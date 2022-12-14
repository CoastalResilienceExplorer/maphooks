export function kFormatter(num, type='$') {
    if (type === '$'){
        const absNum = Math.abs(num)
        if (absNum > 499999999 ) return (Math.abs(num)/1000000000).toFixed(1) + 'B'
        if (absNum > 999999) return (Math.abs(num)/1000000).toFixed(1) + 'M'
        if (absNum > 999) return (Math.abs(num)/1000).toFixed(1) + 'K'
        return absNum.toFixed(0)
    }
    if (type === '%') {
        return (num*100).toFixed(1)
    }
} 

export function formatLocationList(locations) {
    let locationsFormatted;
    if (locations.length === 1) locationsFormatted = locations.at(0)
    if (locations.length === 2) locationsFormatted = locations.at(0) + ' and ' + locations.at(1)
    if (locations.length > 2) locationsFormatted = locations.slice(0, -1).join(', ') + ', and ' + locations.at(-1)
    return locationsFormatted
}