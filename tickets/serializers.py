from rest_framework import serializers
from users.models import CustomUser
from .models import CategoriaTicket, StatusTicket, UrgenciaTicket, Ticket, InteracaoTicket, CampoPersonalizado
from ativos.models import Ativo

class CategoriaTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaTicket
        fields = '__all__'

class StatusTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusTicket
        fields = '__all__'

class UrgenciaTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = UrgenciaTicket
        fields = '__all__'

class AtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ativo
        fields = ['id', 'tag_patrimonio', 'nome', 'modelo', 'estado']

class TicketSerializer(serializers.ModelSerializer):
    status_nome = serializers.CharField(source='status.nome', read_only=True)
    urgencia_nome = serializers.CharField(source='urgencia.nome', read_only=True)
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    criado_por_username = serializers.CharField(source='criado_por.username', read_only=True)
    atribuido_para_username = serializers.CharField(source='atribuido_para.username', read_only=True, allow_null=True)
    ativos_relacionados_info = AtivoSerializer(source='ativos_relacionados', many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'numero_ticket', 'titulo', 'descricao', 'categoria', 'categoria_nome',
            'status', 'status_nome', 'urgencia', 'urgencia_nome', 'criado_por', 'criado_por_username',
            'atribuido_para', 'atribuido_para_username', 'data_criacao', 'data_atualizacao',
            'data_fechamento', 'data_limite', 'tipo', 'ativos_relacionados', 'ativos_relacionados_info'
        ]
        read_only_fields = ['numero_ticket', 'data_criacao', 'data_atualizacao']

class InteracaoTicketSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    ticket_numero = serializers.CharField(source='ticket.numero_ticket', read_only=True)
    
    class Meta:
        model = InteracaoTicket
        fields = '__all__'
        read_only_fields = ['data_criacao']

class CampoPersonalizadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampoPersonalizado
        fields = '__all__'

class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['titulo', 'descricao', 'categoria', 'urgencia', 'tipo', 'ativos_relacionados']
    
    def create(self, validated_data):
        validated_data['criado_por'] = self.context['request'].user
        return super().create(validated_data)

class TicketAtribuicaoSerializer(serializers.Serializer):
    funcionario = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(
            role='funcionario',
            is_approved=True
        )
    )


class TicketStatusUpdateSerializer(serializers.Serializer):
    status = serializers.PrimaryKeyRelatedField(
        queryset=StatusTicket.objects.all()
    )

