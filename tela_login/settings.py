import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Carregar variáveis do .env
load_dotenv(BASE_DIR / ".env")

TINYMCE_API_KEY = os.getenv('TINYMCE_API_KEY')
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")

# DEBUG e HOSTS (Configuração única vinda do .env ou fallback)
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # My Apps
    'menu.apps.MenuConfig',
    'authentication',
    'tela_login',
    'users',
    'tickets',
    'ativos',
    'faq',
    
    # Third Party
    'rest_framework',
    'django_filters',
    'tinymce',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = "tela_login.urls"

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tela_login.wsgi.application'

# Database (MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': "brisa_db",
        'USER': "root",
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': "localhost",
        'PORT': "3306",
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# --- ARQUIVOS ESTÁTICOS (CORRIGIDO) ---

# URL para o navegador
STATIC_URL = 'static/'

# Onde você coloca seus arquivos CSS/JS na pasta raiz
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Onde o Django REÚNE os arquivos após o collectstatic
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuração de Mídia (Uploads de arquivos)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]

AUTH_USER_MODEL = 'users.CustomUser'
LOGIN_URL = 'login'

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

AUTHENTICATION_BACKENDS = [
    'authentication.backends.CustomAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
]
