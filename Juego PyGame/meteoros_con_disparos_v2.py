# -*- coding: utf-8 -*-
import pygame
import random
import os
import math

# ========== CONFIGURACION ==========
WIDTH, HEIGHT = 800, 600
FPS = 60

PLAYER_SPEED = 6
BULLET_SPEED = 11
METEOR_MIN_SPEED = 3
METEOR_MAX_SPEED = 6
MAX_METEORS = 7
FIRE_COOLDOWN_MS = 160  
INVULN_MS = 1200        
START_LIVES = 3

#  
PLAYER_IMG_CAND = ["nave.png"]
METEOR_IMG_CAND = ["meteorito.png", "meteoritt.png"]
BG_IMG_CAND     = ["espacio.png"]
MUSIC_CAND      = ["space.mp3", "bg_music.wav"]
SHOT_SFX_CAND   = ["shoot.wav"]

# ========== ayuda ==========
def load_first_image(cands, size=None, convert_alpha=True):
    for path in cands:
        try:
            img = pygame.image.load(path)
            img = img.convert_alpha() if convert_alpha else img.convert()
            if size:
                img = pygame.transform.smoothscale(img, size)
            print(f"[OK] Loaded image: {path}")
            return img
        except Exception:
            continue
    return None

def load_first_sound(cands, volume=0.5):
    for path in cands:
        try:
            if os.path.exists(path):
                s = pygame.mixer.Sound(path)
                s.set_volume(volume)
                print(f"[OK] Loaded sound: {path}")
                return s
        except Exception as e:
            print(f"[WARN] Couldn't load sound {path}: {e}")
            continue
    return None

def try_play_music(cands, volume=0.25):
    for path in cands:
        try:
            if os.path.exists(path):
                pygame.mixer.music.load(path)
                pygame.mixer.music.set_volume(volume)
                pygame.mixer.music.play(-1)
                print(f"[OK] Music playing: {path}")
                return True
        except Exception as e:
            print(f"[WARN] Couldn't play music {path}: {e}")
            continue
    return False

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

# procesasa balas
def make_bullet_surface(w=6, h=16):
    surf = pygame.Surface((w, h), pygame.SRCALPHA)
    for i in range(h):
        a = 255 - int(255 * (i / h))
        pygame.draw.rect(surf, (255, 255, 0, a), (w//3, i, w//3, 1))
    pygame.draw.rect(surf, (255, 255, 255, 220), (w//2-1, 0, 2, h//3))
    return surf

# Procesa explosiones 
def make_explosion_frames(rmax=28, steps=8):
    frames = []
    for k in range(steps):
        r = int(rmax * (k+1)/steps)
        surf = pygame.Surface((rmax*2+2, rmax*2+2), pygame.SRCALPHA)
        pygame.draw.circle(surf, (255, 200, 50, 180), (rmax+1, rmax+1), r)
        pygame.draw.circle(surf, (255, 80, 0, 160), (rmax+1, rmax+1), max(1, int(r*0.65)))
        pygame.draw.circle(surf, (0,0,0,0), (rmax+1, rmax+1), max(1, int(r*0.45)))
        frames.append(surf)
    return frames

# escuchar
def draw_heart(surface, x, y, size=18, color=(255,70,90)):
    t = pygame.Surface((size, size), pygame.SRCALPHA)
    r = size//4
    pygame.draw.circle(t, color, (r+2, r+2), r+1)
    pygame.draw.circle(t, color, (size-r-2, r+2), r+1)
    pts = [(2, r+2), (size-2, r+2), (size//2, size-2)]
    pygame.draw.polygon(t, color, pts)
    surface.blit(t, (x, y))

# ==================== inicio
pygame.mixer.pre_init(44100, -16, 2, 512)
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Nave vs. Meteoritos — V2 (vidas, explosiones, música)")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)
# carga de archivos con alternativa
player_img = load_first_image(PLAYER_IMG_CAND, size=(70, 70))
meteor_img = load_first_image(METEOR_IMG_CAND, size=(50, 50))
bg_img = load_first_image(BG_IMG_CAND, size=(WIDTH, HEIGHT), convert_alpha=False)
shot_sfx = load_first_sound(SHOT_SFX_CAND, volume=0.45)
try_play_music(MUSIC_CAND, volume=0.3)

bullet_surf = make_bullet_surface()
explosion_frames = make_explosion_frames()

player = pygame.Rect(WIDTH//2-35, HEIGHT-100, 70, 70)

meteors = []
bullets = []
explosions = []  

METEOR_SPAWN_EVENT = pygame.USEREVENT + 1
pygame.time.set_timer(METEOR_SPAWN_EVENT, 600)

score = 0
lives = START_LIVES
running = True
last_shot_time = 0
invuln_until = 0

# ========== bucle principal ==========
while running:
    dt = clock.tick(FPS)
    now = pygame.time.get_ticks()

    # Eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == METEOR_SPAWN_EVENT:
            if len(meteors) < MAX_METEORS:
                m_w, m_h = 44, 44
                m_speed = random.randint(METEOR_MIN_SPEED, METEOR_MAX_SPEED)
                meteor = pygame.Rect(random.randint(0, WIDTH - m_w), -m_h, m_w, m_h)
                meteors.append({"rect": meteor, "vy": m_speed})

    # aporte
    keys = pygame.key.get_pressed()
    dx = (keys[pygame.K_RIGHT] or keys[pygame.K_d]) - (keys[pygame.K_LEFT] or keys[pygame.K_a])
    dy = (keys[pygame.K_DOWN]  or keys[pygame.K_s]) - (keys[pygame.K_UP]   or keys[pygame.K_w])
    player.x += int(dx * PLAYER_SPEED)
    player.y += int(dy * PLAYER_SPEED)
    player.x = clamp(player.x, 0, WIDTH - player.width)
    player.y = clamp(player.y, 0, HEIGHT - player.height)

    if (keys[pygame.K_SPACE] or keys[pygame.K_LCTRL] or keys[pygame.K_RCTRL]) and now - last_shot_time >= FIRE_COOLDOWN_MS:
        b = pygame.Rect(player.centerx - bullet_surf.get_width()//2, player.top - 14, bullet_surf.get_width(), bullet_surf.get_height())
        bullets.append(b)
        last_shot_time = now
        if shot_sfx:
            shot_sfx.play()

    # actualiza viñetas
    for b in bullets[:]:
        b.y -= BULLET_SPEED
        if b.bottom < 0:
            bullets.remove(b)

    # actualiza  meteoritos
    for m in meteors[:]:
        m["rect"].y += m["vy"]
        if m["rect"].top > HEIGHT:
            meteors.remove(m)
            score += 1

    # Balas vs meteorito
    for b in bullets[:]:
        hit = None
        for m in meteors:
            if b.colliderect(m["rect"]):
                hit = m
                break
        if hit:
            bullets.remove(b)
            meteors.remove(hit)
            score += 5
            # explosion
            explosions.append({"x": hit["rect"].centerx, "y": hit["rect"].centery, "i": 0, "timer": now})

    # jugador vs meteorito
    if now > invuln_until:
        for m in meteors[:]:
            if player.colliderect(m["rect"]):
                meteors.remove(m)
                lives -= 1
                invuln_until = now + INVULN_MS
                explosions.append({"x": player.centerx, "y": player.centery, "i": 0, "timer": now})
                break
    if lives <= 0:
        # pantalla de fin de juego
        go = True
        while go:
            for e in pygame.event.get():
                if e.type == pygame.QUIT:
                    go = False
                    running = False
                elif e.type == pygame.KEYDOWN:
                    if e.key == pygame.K_ESCAPE:
                        go = False
                        running = False
                    else:
                        # reiniciar
                        score = 0
                        lives = START_LIVES
                        meteors.clear()
                        bullets.clear()
                        explosions.clear()
                        player.center = (WIDTH//2, HEIGHT-80)
                        invuln_until = 0
                        go = False
            if bg_img:
                screen.blit(bg_img, (0,0))
            else:
                screen.fill((10, 10, 25))
            txt1 = font.render("GAME OVER", True, (255, 100, 100))
            txt2 = font.render("Presiona cualquier tecla para reiniciar (ESC para salir)", True, (230,230,230))
            screen.blit(txt1, (WIDTH//2 - txt1.get_width()//2, HEIGHT//2 - 40))
            screen.blit(txt2, (WIDTH//2 - txt2.get_width()//2, HEIGHT//2 + 5))
            pygame.display.flip()
            pygame.time.delay(10)

    # Dibujar
    if bg_img:
        screen.blit(bg_img, (0, 0))
    else:
        screen.fill((0, 0, 20))

    # jugador (parpadea cuando es invulnerable)
    blink = (now < invuln_until) and ((now // 120) % 2 == 0)
    if not blink:
        if player_img:
            screen.blit(player_img, player.topleft)
        else:
            pygame.draw.rect(screen, (200, 220, 255), player, border_radius=12)

    # Meteoritos
    for m in meteors:
        if meteor_img:
            screen.blit(meteor_img, m["rect"].topleft)
        else:
            pygame.draw.circle(screen, (255, 120, 80), m["rect"].center, m["rect"].width//2)

    # Balas
    for b in bullets:
        screen.blit(bullet_surf, b.topleft)

    # Explosiones
    for ex in explosions[:]:
        idx = ex["i"]
        frame = explosion_frames[min(idx, len(explosion_frames)-1)]
        screen.blit(frame, (ex["x"] - frame.get_width()//2, ex["y"] - frame.get_height()//2))
        if now - ex["timer"] > 40:
            ex["i"] += 1
            ex["timer"] = now
        if ex["i"] >= len(explosion_frames):
            explosions.remove(ex)

    # 
    txt = font.render(f"Puntuación: {score}", True, (255, 255, 255))
    screen.blit(txt, (10, 10))
    # vivos
    for i in range(lives):
        draw_heart(screen, 10 + i*24, 44, size=18)

    hint = font.render("Mover: Flechas/WASD • Disparar: ESPACIO/CTRL • ESC: salir", True, (220, 220, 220))
    screen.blit(hint, (20, HEIGHT-30))

    pygame.display.flip()

    if keys[pygame.K_ESCAPE]:
        running = False

pygame.quit()
