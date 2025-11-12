from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class UserRegistrationSerializer (serializers.ModelSerializer) :
    password = serializers.CharField (write_only=True, validators=[ validate_password ])
    password_confirm = serializers.CharField (write_only=True)

    class Meta :
        model = CustomUser
        fields = ('username', 'email', 'full_name', 'password', 'password_confirm')

    def validate_username(self, value) :
        if not all (c.isalnum () for c in value) or not value[ 0 ].isalpha () :
            raise serializers.ValidationError (
                "Логин должен содержать только латинские буквы и цифры, начинаться с буквы"
            )
        if len (value) < 4 or len (value) > 20 :
            raise serializers.ValidationError ("Логин должен быть от 4 до 20 символов")
        return value

    def validate_password(self, value) :
        if len (value) < 6 :
            raise serializers.ValidationError ("Пароль должен содержать минимум 6 символов")
        if not any (c.isupper () for c in value) :
            raise serializers.ValidationError ("Пароль должен содержать хотя бы одну заглавную букву")
        if not any (c.isdigit () for c in value) :
            raise serializers.ValidationError ("Пароль должен содержать хотя бы одну цифру")
        if not any (not c.isalnum () for c in value) :
            raise serializers.ValidationError ("Пароль должен содержать хотя бы один специальный символ")
        return value

    def validate(self, attrs) :
        if attrs[ 'password' ] != attrs[ 'password_confirm' ] :
            raise serializers.ValidationError ({"password" : "Пароли не совпадают."})
        return attrs

    def create(self, validated_data) :
        validated_data.pop ('password_confirm')
        user = CustomUser.objects.create_user (**validated_data)
        return user


class UserLoginSerializer (serializers.Serializer) :
    username = serializers.CharField ()
    password = serializers.CharField ()


class UserSerializer (serializers.ModelSerializer) :
    storage_stats = serializers.SerializerMethodField ()

    class Meta :
        model = CustomUser
        fields = ('id', 'username', 'email', 'full_name', 'is_admin', 'date_joined', 'storage_stats')
        read_only_fields = ('id', 'date_joined', 'storage_stats')

    def get_storage_stats(self, obj) :
        files = obj.files.all ()
        total_size = sum (file.size for file in files)
        return {
            'file_count' : files.count (),
            'total_size' : total_size,
            'total_size_mb' : round (total_size / (1024 * 1024), 2)
        }