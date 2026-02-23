from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from .groq_client import GroqClient


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def chat(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()

        if not user_message:
            return JsonResponse(
                {"error": "Message is required"},
                status=400
            )

        groq_client = GroqClient()
        response = groq_client.get_chat_response(user_message)

        if 'error' in response:
            return JsonResponse(
                {"error": response['error']},
                status=500
            )

        return JsonResponse({"reply": response['reply']})

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )


@login_required
def chat_view(request):
    """Render the main chat interface"""
    return render(request, 'chatbot/index.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('chat_view')

    form = UserCreationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully.')
            return redirect('chat_view')
        messages.error(request, 'Please fix the errors below.')

    return render(
        request,
        'chatbot/auth.html',
        {'form': form, 'title': 'Sign Up', 'button_text': 'Create Account', 'alt_url_name': 'login', 'alt_label': 'Already have an account? Login'}
    )


def login_view(request):
    if request.user.is_authenticated:
        return redirect('chat_view')

    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            login(request, form.get_user())
            messages.success(request, 'Logged in successfully.')
            return redirect('chat_view')
        messages.error(request, 'Invalid username or password.')

    return render(
        request,
        'chatbot/auth.html',
        {'form': form, 'title': 'Login', 'button_text': 'Login', 'alt_url_name': 'signup', 'alt_label': 'New user? Create an account'}
    )


@login_required
def logout_view(request):
    logout(request)
    messages.info(request, 'Logged out successfully.')
    return redirect('login')
