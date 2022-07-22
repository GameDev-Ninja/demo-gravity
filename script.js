/**
 * Données initiales du jeu
 */
// zone de jeu
let scr = {
    width: 0,
    height: 0
}

// Hauteur de sol
let fHeight = 0

// Mario !
const M = {
    x: 0,
    y: 0,
    v: 0, // La vélocité verticale, indispensable pour appliquer un effet de gravité.
    j: 6, // Vitesse initial de saut en m/s
    size: 75,
    isGrounded: false
}


// La Gravité (9.81 m/s²)
let g = 9.81

// Variable de mise à l'échelle
let conv = 0

// Vitesse de l'effet
let speed = 1

/**
 * Exécutée une seule fois, au chargement
 */
function LoadGame(canvas, ctx) {
    // Interface
    scr.width = canvas.width;
    scr.height = canvas.height;

    // Hauteur de sol
    fHeight = scr.height - 25
    
    // Mario va au sol, au milieu
    M.x = scr.width/2-M.size/2
    M.y = fHeight - M.size

    // Prise en compte des pressions de touches non répétèes
    keyDown('Space', () => {
        if (M.isGrounded) {
            M.v = -M.j * conv
        }
    })
}

/**
 * Exécutée perpétuellement pour mettre à jour les données
 */
function UpdateGame(deltaTime) {
    // Mario mesure 1m55 en "vrai" donc la conversion m => pixel donne
    conv = M.size / 1.55

    // Prise en compte des pressions de touche
    if (isKeyDown('ArrowLeft') && M.x > 0) {console.log('left')
        M.x -= 10
    }
    if (isKeyDown('ArrowRight') && M.x < scr.width - M.size) {console.log('right')
        M.x += 10
    }

    M.y += M.v * deltaTime * speed
    M.isGrounded = M.y + M.size >= fHeight
    
    if(M.isGrounded) {
        M.v = 0
        M.y = fHeight - M.size
    }
    else{
        M.v += g * conv * deltaTime * speed
    }
}

/**
 * Exécutée perpétuellement pour dessiner la frame actuelle
 */
function DrawGame(ctx) {
    drawFloor(ctx)
    drawMario(ctx, M)
    drawRule(ctx)
}
/**
 * Dessine Mario !
 */
function drawMario(ctx, M){
    ctx.fillStyle = "white"
    ctx.fillRect(M.x, M.y, M.size, M.size)
}

/**
 * Petit sol un peu stylé (pas vraiment lol)
 */
function drawFloor(ctx){
    ctx.strokeStyle = "white"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, fHeight)
    ctx.lineTo(scr.width, fHeight)

    // ctx.lineWidth = 1
    for(let i = -25; i < scr.width; i += 15){
        ctx.moveTo(i, scr.height)
        ctx.lineTo(i+25, fHeight)
    }
    ctx.stroke()
}

/**
 * Dessine une règle à l'échelle à gauche
 */
function drawRule(ctx){
    ctx.strokeStyle = "white"
    ctx.fillStyle = "white"
    ctx.lineWidth = 2
    ctx.font = "15px sans"

    let y = fHeight
    let i = 1
    while(y > 0){
        y -= conv
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(15,y)
        ctx.stroke()

        ctx.fillText(`${i} m`, 18, y)
        i++
    }
}

/**
 * Cette fonction permet de charger les variables dans le composant alpine pour les afficher correctement
 * Et du coup on modifie les paramètres ici via les fonctions en propriété de l'objet que reçoit alpine
 */
function settings(){
    return {
        Msize: M.size,
        Mj : M.j,
        speed: speed,
        g: g,
        plusMsize: function(){
            M.size += 5
            this.Msize = M.size
        },
        minMsize: function(){
            M.size -= 5
            this.Msize = M.size
        },
        plusMj: function(){
            M.j += 1
            this.Mj = M.j
        },
        minMj: function(){
            M.j -= 1
            this.Mj = M.j
        },
        plusSpeed: function(){
            speed += 0.5
            this.speed = speed
        },
        minSpeed: function(){
            speed -= 0.5
            this.speed = speed
        },
        plusG: function(){
            g += 1
            this.g = g
        },
        minG: function(){
            g -= 1
            this.g = g
        },
    }
}