

export const objToParams = (obj: { [key: string]: string | number | null }) => {

    const list: string[] = []

    Object.keys(obj).forEach((item) => {
        const str = obj[item] ?? ""

        list.push(
            `${[item]}=${encodeURIComponent(str)}`
        )
    })

    return list?.length ? "?" + list.join("&") : ""

}
