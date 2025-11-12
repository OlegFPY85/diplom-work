from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout, authenticate
from django.utils import timezone
import logging
from .models import CustomUser
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer
)
from .permissions import IsAdminUser

logger = logging.getLogger (__name__)


class AuthViewSet (viewsets.ViewSet) :
    permission_classes = [ AllowAny ]

    @action (detail=False, methods=[ 'post' ])
    def register(self, request) :
        logger.info (f"Регистрация пользователя: {request.data.get ('username')}")
        serializer = UserRegistrationSerializer (data=request.data)

        if serializer.is_valid () :
            user = serializer.save ()
            login (request, user)

            logger.info (f"Пользователь {user.username} успешно зарегистрирован")
            return Response ({
                'user' : UserSerializer (user).data,
            }, status=status.HTTP_201_CREATED)

        logger.warning (f"Ошибка регистрации: {serializer.errors}")
        return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action (detail=False, methods=[ 'post' ])
    def login(self, request) :
        username = request.data.get ('username')
        logger.info (f"Попытка входа пользователя: {username}")

        serializer = UserLoginSerializer (data=request.data)
        if serializer.is_valid () :
            user = authenticate (
                username=serializer.validated_data[ 'username' ],
                password=serializer.validated_data[ 'password' ]
            )

            if user :
                login (request, user)
                logger.info (f"Пользователь {username} успешно вошел в систему")
                return Response ({
                    'user' : UserSerializer (user).data,
                })

            logger.warning (f"Неудачная попытка входа для пользователя: {username}")
            return Response (
                {'error' : 'Неверные учетные данные'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action (detail=False, methods=[ 'post' ])
    def logout(self, request) :
        if request.user.is_authenticated :
            logger.info (f"Пользователь {request.user.username} вышел из системы")
            logout (request)
        return Response ({'message' : 'Успешный выход'})


class UserViewSet (viewsets.ModelViewSet) :
    serializer_class = UserSerializer
    permission_classes = [ IsAuthenticated ]

    def get_queryset(self) :
        if self.request.user.is_admin :
            return CustomUser.objects.all ().prefetch_related ('files')
        return CustomUser.objects.filter (id=self.request.user.id).prefetch_related ('files')

    def get_permissions(self) :
        if self.action in [ 'list', 'update', 'partial_update', 'destroy' ] :
            return [ IsAuthenticated (), IsAdminUser () ]
        return [ IsAuthenticated () ]

    @action (detail=False, methods=[ 'get' ])
    def me(self, request) :
        serializer = self.get_serializer (request.user)
        return Response (serializer.data)

    def destroy(self, request, *args, **kwargs) :
        instance = self.get_object ()
        if instance == request.user :
            return Response (
                {'error' : 'Нельзя удалить собственный аккаунт'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy (instance)
        logger.info (f"Пользователь {instance.username} удален администратором {request.user.username}")
        return Response (status=status.HTTP_204_NO_CONTENT)