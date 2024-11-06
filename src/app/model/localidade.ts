export interface LocalidadeListItem {
  localidade_id: number;
  nome: string;
  status: string;
  localidade_nome: string;
  numero_bens: number;
}

export interface InventarioLocalidade {
  localidade_id: number;
  localidade_nome: string;
  ano_inventario: string;
  inventario_localidade_id: number;
  relatorio: string;
  numero_bens: number;
  status_inventario: string;
}



/* 

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
*/