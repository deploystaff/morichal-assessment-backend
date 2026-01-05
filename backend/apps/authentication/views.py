from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated


class LoginView(APIView):
    """User login endpoint."""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    """User logout endpoint."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'success': True})


class MeView(APIView):
    """Get current user info."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })


class CSRFTokenView(APIView):
    """Get CSRF token for frontend."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'csrfToken': get_token(request)})
