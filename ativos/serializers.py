from rest_framework import serializers
from .models import TipoAtivo, Fabricante, Localizacao, Ativo, Software, InstalacaoSoftware, Contrato, ContratoAtivo


class TipoAtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAtivo
        fields = '__all__'

class FabricanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fabricante
        fields = '__all__'

class LocalizacaoSerializer(serializers.ModelSerializer):
    responsavel_username = serializers.CharField(source='responsavel.username', read_only=True)
    
    class Meta:
        model = Localizacao
        fields = '__all__'

class AtivoSerializer(serializers.ModelSerializer):
    tipo_nome = serializers.CharField(source='tipo.nome', read_only=True)
    fabricante_nome = serializers.CharField(source='fabricante.nome', read_only=True)
    localizacao_nome = serializers.CharField(source='localizacao.nome', read_only=True)
    usuario_final_username = serializers.CharField(source='usuario_final.username', read_only=True)
    
    class Meta:
        model = Ativo
        fields = [
            'id', 'tag_patrimonio', 'numero_serie', 'nome', 'descricao', 'tipo', 'tipo_nome',
            'fabricante', 'fabricante_nome', 'modelo', 'localizacao', 'localizacao_nome',
            'usuario_final', 'usuario_final_username', 'estado', 'data_aquisicao',
            'data_garantia', 'especificacoes', 'data_criacao', 'data_atualizacao'
        ]
        read_only_fields = ['data_criacao', 'data_atualizacao']

class SoftwareSerializer(serializers.ModelSerializer):
    fabricante_nome = serializers.CharField(source='fabricante.nome', read_only=True)
    licencas_disponiveis = serializers.ReadOnlyField()
    
    class Meta:
        model = Software
        fields = '__all__'

class InstalacaoSoftwareSerializer(serializers.ModelSerializer):
    software_nome = serializers.CharField(source='software.nome', read_only=True)
    ativo_nome = serializers.CharField(source='ativo.nome', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = InstalacaoSoftware
        fields = '__all__'

class ContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrato
        fields = '__all__'

class ContratoAtivoSerializer(serializers.ModelSerializer):
    contrato_numero = serializers.CharField(source='contrato.numero', read_only=True)
    ativo_nome = serializers.CharField(source='ativo.nome', read_only=True)
    
    class Meta:
        model = ContratoAtivo
        fields = '__all__'