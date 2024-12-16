export const getFilteredBenefits = (
    benefits: any,
    id: any,
    clientMode: any,
    // currentTitle: any,
    titles: any,
    currentUser: any
) => {
    let benefitsToShow: any;

    if (id !== "0") {
        if (clientMode === "USER") {
            benefitsToShow =
                benefits.filter((b: any) => currentUser?.clubs.includes(b.clubId)) || [];
            const currentTitle = titles[1];
        } else if (clientMode === "SUPPLIER") {
            benefitsToShow = benefits.filter((b: any) => b.supplierId === id) || [];
            const currentTitle = titles[2];
        }
    } else {
        benefitsToShow =
            benefits?.filter(
                (b: any) => b.expirationDate && new Date(b.expirationDate) >= new Date()
            ) || [];
    }

    return benefitsToShow;
}
