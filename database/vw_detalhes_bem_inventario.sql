create view
  public.vw_detalhes_bem_inventario as
select
  b.id as bem_id,
  b.inventario_id,
  b.patrimonio,
  b.descricao,
  b.estado_bem as estado,
  b.indica_desfazimento,
  b.observacoes,
  b.created_at as cadastrado_em,
  b.imagem as url_imagem,
  l.nome as localidade_nome,
  u.nome as usuario_cadastrante
from
  bens b
  join localidades l on b.localidade_id = l.id
  left join usuarios u on b.usuario_id = u.id;