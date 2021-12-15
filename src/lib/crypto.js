import bcryptjs from "bcryptjs";

export const encryptPassword = async function (password) {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    return hash;
};

export const matchPassword = async function (password, savedPassword) {
    try {
        return await bcryptjs.compare(password, savedPassword);
    } catch (e) {
        console.log(e)
    }
};

export const encryptData = async function (data, nonce) {
    const salt = await bcryptjs.genSalt(nonce);
    const hash = await bcryptjs.hash(data, salt);
    return hash;
};