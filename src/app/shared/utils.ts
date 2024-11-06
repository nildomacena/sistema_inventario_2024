export function formatarStatus(status: string) {
    switch (status) {
        case 'finalizada':
            return 'Finalizado';
        case 'em_andamento':
            return 'Em andamento';
        case 'nao_iniciada':
            return 'Não iniciado';
        default:
            return status;
    }
}
