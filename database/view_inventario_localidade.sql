create view
  public.view_inventario_localidade as
select
  l.id as localidade_id,
  l.nome as localidade_nome,
  i.ano as ano_inventario,
  i.id as inventario_localidade_id,
  i.relatorio,
  count(b.id) as numero_bens,
  i.status as status_inventario
from
  localidades l
  join inventario_localidade i on l.id = i.localidade_id
  left join bens b on i.id = b.inventario_id
group by
  l.id,
  l.nome,
  i.ano,
  i.id,
  i.relatorio,
  i.status;