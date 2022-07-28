class Asteroid {
    static velocity = 1 / 15
    static asteroids = []

    constructor(xPos, yPos) {
        const asteroid = document.createElement("div")

        let width = 0
        let height = 0

        this.y = yPos
        width = Math.floor((Math.random() * (6 - 4)) + 4)
        height = width * 2

        asteroid.className = "asteroid"
        asteroid.style.backgroundColor = "black"
        asteroid.style.width = width + "vw"
        asteroid.style.height = height + "vh"
        asteroid.style.left = xPos + "vw"
        asteroid.style.top = yPos + "vh"

        document.body.appendChild(asteroid)
        Asteroid.asteroids.push(asteroid)
        this.drop(asteroid)
    }
    drop(asteroid) {
        const updateYPosition = setInterval(() => {
            this.y += Asteroid.velocity
            asteroid.style.top = this.y + "vh"
            if (this.y >= 90 && document.body.contains(asteroid)) {
                clearInterval(updateYPosition)
                document.body.removeChild(asteroid)
                Asteroid.asteroids.splice(Asteroid.asteroids.indexOf(asteroid), 1)
            }
        }, 1);
    }
}

class Bullet {
    static velocity = 1
    static WIDTH = 25
    static HEIGHT = 25

    constructor(xPos, yPos) {
        this.xPos = xPos
        this.yPos = yPos
        this.y = this.yPos
        this.create()
    }
    create(){
        const bullet = document.createElement("div")
        
        bullet.className = "bullet"
        bullet.style.backgroundColor = "black"
        bullet.style.width = Bullet.WIDTH + "px"
        bullet.style.height = Bullet.HEIGHT + "px"
        bullet.style.left = (((this.xPos * window.innerWidth) / 100) + (Bullet.WIDTH / 2)) + "px" // make it centered
        bullet.style.top = this.yPos + "vh"

        document.body.appendChild(bullet)
        this.move(bullet)
    }
    move(bullet) {
        const updateYPosition = setInterval(() => {
            this.y -= Bullet.velocity
            bullet.style.top = this.y + "vh"
            const asteroid = this.checkCollision(bullet)

            if (document.body.contains(asteroid)){
                asteroid.style.backgroundColor = "red"
                document.body.removeChild(bullet)
                setTimeout(() => {
                    document.body.removeChild(asteroid)
                    clearInterval(updateYPosition)
                }, 35)
            }

            if (this.y <= 0) {
                clearInterval(updateYPosition)
                document.body.removeChild(bullet)
            }
        }, 1);
    }
    checkCollision(bullet) {
        if (Asteroid.asteroids.length > 0){
            for (const asteroid of Asteroid.asteroids) {
                const rect1 = asteroid.getBoundingClientRect();
                const rect2 = bullet.getBoundingClientRect();
    
                const isInHoriztonalBounds =
                    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
                const isInVerticalBounds =
                    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    
                const isColliding = isInHoriztonalBounds && isInVerticalBounds;

                if (isColliding){
                    return asteroid
                }
            }
        }
    }
}

class Player {
    static fall_height = 70 // vh

    constructor(size, color) {
        const player = document.createElement("div")

        this.width = size.width // px
        this.height = size.height // px
        this.color = color
        this.action = "standing"
        this.yVelocity = (1) / (2.5) // vh
        this.xVelocity = 3 // vw
        this.y = 90 // vh
        this.x = 0 // vw

        player.style.width = this.width + "px"
        player.style.height = this.height + "px"
        player.style.backgroundColor = this.color
        player.className = "Player"

        document.body.appendChild(player)

        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case " ":
                    this.jump(player)
                    break;
                case "a":
                    this.move("left", player)
                    break;
                case "d":
                    this.move("right", player)
                    break;
                case "q":
                    this.shoot(player)
                    break;
            }
        })
    }
    jump(player) {
        if (this.action == "standing") {
            this.action = "jumping"
            const updateYPosition = setInterval(() => {
                this.y -= this.yVelocity
                player.style.top = this.y + "vh"
                if (this.y <= Player.fall_height) {
                    clearInterval(updateYPosition)
                    this.applyGravity(player)
                }
            }, 1);
        }
    }
    applyGravity(player) {
        if (this.action == "jumping") {
            const updateYPosition = setInterval(() => {
                if (this.y >= 90) { // vh
                    clearInterval(updateYPosition)
                    this.action = "standing"
                }
                else {
                    this.y += this.yVelocity
                    player.style.top = this.y + "vh"
                }
            }, 1);
        }
    }
    detectVerticalCollision() {
        if (this.x < 0) {
            this.x = 95
        }
        else if (this.x > 95) {
            this.x = 0
        }
        return this.x
    }
    move(direction, player) {
        switch (direction) {
            case "left":
                this.x -= this.xVelocity
                this.x = this.detectVerticalCollision()
                player.style.left = this.x + "vw"
                break;
            case "right":
                this.x += this.xVelocity
                this.x = this.detectVerticalCollision()
                player.style.left = this.x + "vw"
                break;
        }
    }
    shoot() {
        new Bullet(this.x, this.y - 3)
    }
}

const player = new Player({ width: 50, height: 50 }, "black")

setInterval(() => {
    const randomX = Math.random() * 90, randomY = Math.random() * 10
    const asteroid = new Asteroid(randomX, randomY)
}, 1500);

