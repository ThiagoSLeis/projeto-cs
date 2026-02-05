from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        if not user.is_approved:
            raise AuthenticationFailed("Sua conta ainda não foi aprovada.")

        data["role"] = user.role

        return data

