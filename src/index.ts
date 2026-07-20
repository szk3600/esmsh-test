// szk3600/esmsh-test - Interactive Physics Particle Engine
// 物理演算ベースのパーティクルエフェクト・ライブラリ

export class Vector2D {
    constructor(public x: number = 0, public y: number = 0) {}

    add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    mult(n: number): Vector2D {
        return new Vector2D(this.x * n, this.y * n);
    }

    div(n: number): Vector2D {
        return n !== 0 ? new Vector2D(this.x / n, this.y / n) : new Vector2D(0, 0);
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2D {
        const m = this.mag();
        return m !== 0 ? this.div(m) : new Vector2D(0, 0);
    }

    dist(v: Vector2D): number {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
}

export interface ParticleOptions {
    position: Vector2D;
    velocity?: Vector2D;
    radius?: number;
    color?: string;
    mass?: number;
    decay?: number; // 寿命の減衰速度
}

export class Particle {
    pos: Vector2D;
    vel: Vector2D;
    acc: Vector2D;
    radius: number;
    color: string;
    mass: number;
    life: number = 1.0; // 1.0 (生) -> 0.0 (死)
    decay: number;

    constructor(options: ParticleOptions) {
        this.pos = options.position;
        this.vel = options.velocity || new Vector2D(0, 0);
        this.acc = new Vector2D(0, 0);
        this.radius = options.radius || 4;
        this.color = options.color || '#6366f1';
        this.mass = options.mass || 1.0;
        this.decay = options.decay || 0.005;
    }

    applyForce(force: Vector2D) {
        // f = m * a  => a = f / m
        const f = force.div(this.mass);
        this.acc = this.acc.add(f);
    }

    update() {
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
        this.acc = this.acc.mult(0); // 加速度クリア
        this.life -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 1.5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }

    isDead(): boolean {
        return this.life <= 0 || this.radius <= 0.1;
    }
}

export class AttractionWell {
    constructor(
        public pos: Vector2D,
        public strength: number = 200,
        public radius: number = 150
    ) {}

    calculateAttraction(particle: Particle): Vector2D {
        const force = this.pos.sub(particle.pos);
        const distance = force.mag();
        
        if (distance < 10 || distance > this.radius) {
            return new Vector2D(0, 0);
        }

        // 距離の2乗に反比例する引力
        const strength = (this.strength * particle.mass) / (distance * distance);
        return force.normalize().mult(strength);
    }
}

export class PhysicsWorld {
    particles: Particle[] = [];
    wells: AttractionWell[] = [];
    gravity: Vector2D = new Vector2D(0, 0.1); // 標準下向き重力
    friction: number = 0.98; // 速度の減衰（空気抵抗）

    constructor(public width: number, public height: number) {}

    addParticle(p: Particle) {
        this.particles.push(p);
    }

    addWell(well: AttractionWell) {
        this.wells.push(well);
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 1. 重力の適用
            p.applyForce(this.gravity.mult(p.mass));

            // 2. 引力ウェルの影響
            for (const well of this.wells) {
                const attract = well.calculateAttraction(p);
                p.applyForce(attract);
            }

            // 3. 更新
            p.update();
            p.vel = p.vel.mult(this.friction); // 摩擦

            // 4. 壁の衝突判定
            this.handleBoundaries(p);

            // 5. 寿命が尽きたパーティクルの破棄
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    handleBoundaries(p: Particle) {
        const bounce = -0.6; // 反発係数
        
        if (p.pos.x - p.radius < 0) {
            p.pos.x = p.radius;
            p.vel.x *= bounce;
        } else if (p.pos.x + p.radius > this.width) {
            p.pos.x = this.width - p.radius;
            p.vel.x *= bounce;
        }

        if (p.pos.y - p.radius < 0) {
            p.pos.y = p.radius;
            p.vel.y *= bounce;
        } else if (p.pos.y + p.radius > this.height) {
            p.pos.y = this.height - p.radius;
            p.vel.y *= bounce;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // パーティクルの描画
        for (const p of this.particles) {
            p.draw(ctx);
        }

        // 引力ウェルの可視化
        for (const well of this.wells) {
            ctx.save();
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(well.pos.x, well.pos.y, well.radius, 0, Math.PI * 2);
            ctx.stroke();

            // 中心コア
            ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
            ctx.beginPath();
            ctx.arc(well.pos.x, well.pos.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
