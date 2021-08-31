export const formatDateSimple = (date: Date): string => {
    const localeDateString = date.toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const splitted = localeDateString.split('/');
    const year = splitted[2];
    const month = splitted[0];
    const day = splitted[1];
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}

export const formatDateShort = (date: Date): string => {
    let mm: any = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    return `${date.getFullYear()}-${mm}`
}
