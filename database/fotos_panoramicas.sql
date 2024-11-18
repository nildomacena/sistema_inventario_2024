create table
  public.fotos_panoramicas (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone not null default now(),
    url text not null,
    inventario_id bigint not null,
    path_file text null,
    constraint fotos_panoramicas_pkey primary key (id),
    constraint fotos_panoramicas_inventario_id_fkey foreign key (inventario_id) references inventario_localidade (id)
  ) tablespace pg_default;