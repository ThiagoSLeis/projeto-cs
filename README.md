# Projeto CS

Este projeto é uma aplicação desenvolvida com **Django** utilizando **MySQL** como banco de dados.

---

## 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Python 3.10 ou superior
- Git
- MySQL
- pip
- virtualenv (opcional, mas recomendado)

---

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/ThiagoSLeis/projeto-cs.git
cd projeto-cs
2️⃣ Criar e ativar o ambiente virtual
Windows
python -m venv venv
venv\Scripts\activate
Linux / Mac
python3 -m venv venv
source venv/bin/activate
3️⃣ Instalar as dependências
pip install -r requirements.txt
4️⃣ Criar o banco de dados MySQL
Acesse o MySQL e execute:

CREATE DATABASE BRISA_DB;
5️⃣ Criar o arquivo .env
Na raiz do projeto, crie um arquivo chamado .env e adicione:

DB_PASSWORD=suasenhaaqui
⚠️ Importante: Nunca versionar o arquivo .env.
Verifique se ele está listado no .gitignore.

6️⃣ Executar as migrações
python manage.py makemigrations
python manage.py migrate
7️⃣ Criar superusuário
python manage.py createsuperuser
Siga as instruções no terminal para criar o usuário administrador.

8️⃣ Rodar o servidor
python manage.py runserver
Acesse no navegador:

Aplicação: http://127.0.0.1:8000/

Admin: http://127.0.0.1:8000/admin/

🛠 Tecnologias Utilizadas
Python

Django

MySQL

HTML / CSS / Bootstrap