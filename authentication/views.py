import re
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import RegistrationForm
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


def login_view(request):
    if request.method == 'POST':
        cpf = request.POST.get('cpf')
        password = request.POST.get('password')

        user = authenticate(request, username=cpf, password=password)

        if not user:
            messages.error(request, 'CPF ou senha inválidos.')
            return render(request, 'authentication/login.html')

        if not user.is_approved:
            messages.error(request, 'Seu cadastro ainda não foi aprovado.')
            return render(request, 'authentication/login.html')

        login(request, user)

        if user.role == 'admin':
            return redirect('citiesoft_home')

        if user.role == 'funcionario':
            return redirect('citiesoft_home')

        if user.role == 'cliente':
            return redirect('template_cliente')

        messages.error(request, 'Perfil inválido.')
        return redirect('login')

    return render(request, 'authentication/login.html')




@login_required
def dashboard_view(request):
    return render(request, 'citiesoft_home.html')

@login_required
def menu_view(request):
    return redirect('citiesoft_home.html')


def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            user.is_active = True           # pode autenticar
            user.is_approved = False        # ainda NÃO aprovado
            user.save()

            messages.success(
                request,
                'Cadastro realizado! Aguarde a aprovação do administrador.'
            )
            return redirect('login')

    else:
        form = RegistrationForm()

    return render(request, 'authentication/register.html', {'form': form})


def recuperar_view (request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            # O email será mostrado no console
            form.save(
                request=request,
                use_https=request.is_secure(),
                token_generator=default_token_generator,
                email_template_name='auth/email_recuperacao.html',
                subject_template_name='auth/email_recuperacao_assunto.txt'
            )
            return redirect('recuperar_sucesso')
    else:
        form = PasswordResetForm()

    return render(request, 'authentication/recuperar.html')


def resetar_view(request):
    return render(request, 'authentication/resetar.html')

def recuperar_senha(request):
    if request.method == 'POST':
        form = RecuperarSenhaForm(request.POST)
        if form.is_valid():
            # Processar a recuperação de senha aqui
            email = form.cleaned_data['email']
            messages.success(request, 'Instruções para redefinir sua senha foram enviadas para seu e-mail.')
            return redirect('login')
    else:
        form = RecuperarSenhaForm()
    
    return render(request, 'recuperar_senha.html', {'form': form})

def password_reset(request):
    view = auth_views.PasswordResetView.as_view(template_name="authentication/recuperar.html")
    return view(request)

def password_reset_done(request):
    view = auth_views.PasswordResetDoneView.as_view(template_name="authentication/password_reset_done.html")
    return view(request)

#def password_reset_complete(request):
    #view = auth_views.PasswordResetCompleteView.as_view(template_name="authentication/password_reset_complete.html")
   # return view(request)#

def password_reset_confirm(request, uidb64=None, token=None):
    view = auth_views.PasswordResetConfirmView.as_view(
        template_name="authentication/resetar.html",
        success_url=reverse_lazy("password_reset_complete")
    )
    return view(request, uidb64=uidb64, token=token)

def password_reset_complete(request):
    messages.success(request, "Senha redefinida com sucesso! Agora faça login.")
    return redirect("login")

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role
        token['is_approved'] = user.is_approved
        token['cpf'] = user.cpf

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer