# -*- coding: utf-8 -*-
import pygame
import random
import os

# ---------------- Config ----------------
WIDTH, HEIGHT = 800, 600
FPS = 60 
PLAYER_SPEED = 6
BULLET_SPEED = 10 
METEOR_MIN_SPEED = 3
METEOR_MAX_SPEED = 6
MAX_METEORS = 7
FIRE_COOLDOWN_MS = 220  # milliseconds between shots

# Asset filenames (will try images first; fall back to shapes)
PLAYER_IMG = "nave.png"
METEOR_IMG = "meteorito.png"
BG_IMG = "espacio.png"
BG_MUSIC = "space.mp3"
SHOT_SFX = "shoot.wav"

# --------------- Helpers ----------------
def load_image(path, size=None, convert_alpha=True):
    try:
        img = pygame.image.load(path)
        img = img.convert_alpha() if convert_alpha else img.convert()
        if size is not None:
            img = pygame.transform.smoothscale(img, size)
        return img
    except Exception:
        return None

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

# --------------- Game Init --------------
pygame.init()
pygame.mixer.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Nave vs. Meteoritos — con disparos y música")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Try to load assets (fallbacks are shapes if images missing)
player_img = load_image(PLAYER_IMG, size=(60, 60))
meteor_img = load_image(METEOR_IMG, size=(50, 50))
bg_img = load_image(BG_IMG, size=(WIDTH, HEIGHT), convert_alpha=False)

# Sounds (optional if files exist)
def safe_load_sound(fname, volume=0.5):
    try:
        s = pygame.mixer.Sound(fname)
        s.set_volume(volume)
        return s
    except Exception:
        return None

shot_sfx = safe_load_sound(SHOT_SFX, volume=0.4)

# Background music loop
try:
    if os.path.exists(BG_MUSIC):
        pygame.mixer.music.load(BG_MUSIC)
        pygame.mixer.music.set_volume(0.25)
        pygame.mixer.music.play(-1)  # loop forever
except Exception:
    pass

# Player rect positioned near bottom center
player_size = (60, 60)
player = pygame.Rect(WIDTH//2 - player_size[0]//2, HEIGHT - player_size[1] - 20, *player_size)

# Lists for game entities
meteors = []
bullets = []

# Spawn timer for meteors
METEOR_SPAWN_EVENT = pygame.USEREVENT + 1
pygame.time.set_timer(METEOR_SPAWN_EVENT, 600)  # every 0.6s (adjust to taste)

score = 0
running = True
last_shot_time = 0

# --------------- Main Loop --------------
while running:
    dt = clock.tick(FPS)
    now = pygame.time.get_ticks()

    # ---- Events ----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == METEOR_SPAWN_EVENT:
            if len(meteors) < MAX_METEORS:
                m_w, m_h = 40, 40
                m_speed = random.randint(METEOR_MIN_SPEED, METEOR_MAX_SPEED)
                meteor = pygame.Rect(random.randint(0, WIDTH - m_w), -m_h, m_w, m_h)
                meteors.append({"rect": meteor, "vy": m_speed})

    # Keyboard (movement + shooting)
    keys = pygame.key.get_pressed()
    dx = (keys[pygame.K_RIGHT] or keys[pygame.K_d]) - (keys[pygame.K_LEFT] or keys[pygame.K_a])
    dy = (keys[pygame.K_DOWN]  or keys[pygame.K_s]) - (keys[pygame.K_UP]   or keys[pygame.K_w])
    player.x += int(dx * PLAYER_SPEED)
    player.y += int(dy * PLAYER_SPEED)
    player.x = clamp(player.x, 0, WIDTH - player.width)
    player.y = clamp(player.y, 0, HEIGHT - player.height)

    # Shooting (Space or Ctrl)
    if (keys[pygame.K_SPACE] or keys[pygame.K_LCTRL] or keys[pygame.K_RCTRL]) and now - last_shot_time >= FIRE_COOLDOWN_MS:
        bullet = pygame.Rect(player.centerx - 3, player.top - 10, 6, 14)
        bullets.append(bullet)
        last_shot_time = now
        if shot_sfx:
            shot_sfx.play()

    # ---- Update bullets ----
    for b in bullets[:]:
        b.y -= BULLET_SPEED
        if b.bottom < 0:
            bullets.remove(b)

    # ---- Update meteors ----
    for m in meteors[:]:
        m["rect"].y += m["vy"]
        if m["rect"].top > HEIGHT:
            meteors.remove(m)
            score += 1  # survived one meteor

    # ---- Collisions: bullets vs meteors ----
    for b in bullets[:]:
        hit = None
        for m in meteors:
            if b.colliderect(m["rect"]):
                hit = m
                break
        if hit:
            bullets.remove(b)
            meteors.remove(hit)
            score += 5  # bonus for destroying meteor

    # ---- Collisions: player vs meteors (game over) ----
    for m in meteors:
        if player.colliderect(m["rect"]):
            running = False

    # ---- Draw ----
    if bg_img:
        screen.blit(bg_img, (0, 0))
    else:
        screen.fill((0, 0, 20))

    # player
    if player_img:
        screen.blit(player_img, player.topleft)
    else:
        pygame.draw.rect(screen, (200, 200, 255), player, border_radius=12)

    # meteors
    for m in meteors:
        if meteor_img:
            screen.blit(meteor_img, m["rect"].topleft)
        else:
            pygame.draw.circle(screen, (255, 120, 80), m["rect"].center, m["rect"].width//2)

    # bullets
    for b in bullets:
        pygame.draw.rect(screen, (255, 255, 0), b, border_radius=3)

    # HUD
    txt = font.render(f"Puntuación: {score}", True, (255, 255, 255))
    screen.blit(txt, (10, 10))
    hint = font.render("Flechas/WASD para mover • ESPACIO/CTRL para disparar • ESC para salir", True, (220, 220, 220))
    screen.blit(hint, (20, HEIGHT-30))

    pygame.display.flip()

    # Quick exit
    if keys[pygame.K_ESCAPE]:
        running = False

pygame.quit()
