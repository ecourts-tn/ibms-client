import { useContext } from "react";
import { AuthContext } from "contexts/AuthContext";

export const useRoles = () => {
    const { user } = useContext(AuthContext);

    const roleNames = user?.roles?.map(role => role.role_name) || [];

    const isAdmin = roleNames.includes("Admin");
    const isCourt = roleNames.includes("Court");
    const isJudge = roleNames.includes("Judge");
    const isSteno = roleNames.includes("Court Steno");
    const isFORA = roleNames.includes("FORA");
    const isLegalAid = roleNames.includes("Legal Aid");
    const isEFiling = roleNames.includes("eFiling");
    const isIO = roleNames.includes("Investigation Officer");
    const isJailer = roleNames.includes("Jailer/Warden");
    const isAdvocate = roleNames.includes("Advocate");
    const isLitigant = roleNames.includes("Litigant");
    const isProsecutor = roleNames.includes("Public Prosecutor");

    return {
        isAdmin,
        isCourt,
        isJudge,
        isSteno,
        isFORA,
        isLegalAid,
        isEFiling,
        isIO,
        isJailer,
        isAdvocate,
        isLitigant,
        isProsecutor
    };
};
