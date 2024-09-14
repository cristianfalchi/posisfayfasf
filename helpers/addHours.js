export const addHours = (horaComplete, cant) => {

    if (horaComplete !== '--:--:--') {
        const hora = horaComplete.split(':')[0];
        switch (hora) {
            case '21':
                return horaComplete.replace('21', '00');
                break;
            case '22':
                return horaComplete.replace('22', '01');
                break;
            case '23':
                return horaComplete.replace('23', '02');
                break;
            default:
                const calculoHora = (Number(hora) < 7) ? '0' + `${Number(hora) + 3}` : `${Number(hora) + 3}`;
                return horaComplete.replace(hora, calculoHora);
                break;
        }

    } else {
        return horaComplete;
    }
}
