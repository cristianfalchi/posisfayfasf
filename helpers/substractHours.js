
// restamos tres horas
export const substractHours = (horaComplete) => {

    if (horaComplete !== '--:--:--') {
        const hora = horaComplete.split(':')[0];
        switch (hora) {
            case '02':
                return horaComplete.replace('02', '23');
                break;
            case '01':
                return horaComplete.replace('01', '22');
                break;
            case '00':
                return horaComplete.replace('00', '21');
                break;
            default:
                const calculoHora = (Number(hora) < 13) ? '0' + `${Number(hora) - 3}` : `${Number(hora) - 3}`;
                return horaComplete.replace(hora, calculoHora);
                break;
        }

    } else {
        return horaComplete;
    }
}