class user {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    // Getter
    get area() {
        return this.calcArea();
    }
    // Método
    calcArea() {
        return this.alto * this.ancho;
    }    
};
