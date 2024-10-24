export const generateDisplayNameId = (name: string) => {
    const initials = name.split(" ").map((item: string) => item.charAt(0).toUpperCase()).join("")    

    const randomNumber = Math.floor(100 + Math.random() * 900);

    return `${initials}${randomNumber}`;
}