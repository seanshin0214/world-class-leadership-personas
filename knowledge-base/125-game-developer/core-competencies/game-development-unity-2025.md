# Game Development with Unity 2025

**Updated**: 2025-11-23 | **Engine**: Unity 2023 LTS, C#, Game Design

---

## Unity Basics

```csharp
// Player Movement (2D)
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;
    
    private Rigidbody2D rb;
    private bool isGrounded;
    
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update()
    {
        // Horizontal movement
        float moveInput = Input.GetAxis("Horizontal");
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);
        
        // Jump
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }
    
    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }
    
    void OnCollisionExit2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = false;
        }
    }
}

---

// Camera Follow (Smooth)
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float smoothSpeed = 0.125f;
    [SerializeField] private Vector3 offset;
    
    void LateUpdate()
    {
        Vector3 desiredPosition = target.position + offset;
        Vector3 smoothedPosition = Vector3.Lerp(transform.position, desiredPosition, smoothSpeed);
        transform.position = smoothedPosition;
    }
}

---

// Collectible Items
public class Collectible : MonoBehaviour
{
    [SerializeField] private int points = 10;
    
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            // Add to score
            GameManager.Instance.AddScore(points);
            
            // Play sound
            AudioManager.Instance.PlaySound("Coin");
            
            // Destroy coin
            Destroy(gameObject);
        }
    }
}

---

// Game Manager (Singleton)
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    public int score = 0;
    public int lives = 3;
    
    void Awake()
    {
        // Singleton pattern
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void AddScore(int points)
    {
        score += points;
        UIManager.Instance.UpdateScore(score);
    }
    
    public void LoseLife()
    {
        lives--;
        UIManager.Instance.UpdateLives(lives);
        
        if (lives <= 0)
        {
            GameOver();
        }
    }
    
    void GameOver()
    {
        // Show game over screen
        UIManager.Instance.ShowGameOver();
        
        // Stop gameplay
        Time.timeScale = 0;
    }
    
    public void RestartGame()
    {
        Time.timeScale = 1;
        UnityEngine.SceneManagement.SceneManager.LoadScene(
            UnityEngine.SceneManagement.SceneManager.GetActiveScene().name
        );
    }
}
```

---

## 3D Movement & Combat

```csharp
// Third-Person Character Controller
using UnityEngine;

public class ThirdPersonController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float sprintSpeed = 8f;
    [SerializeField] private float rotationSpeed = 10f;
    
    [Header("Camera")]
    [SerializeField] private Transform cameraTransform;
    
    private CharacterController controller;
    private Animator animator;
    private Vector3 velocity;
    private bool isGrounded;
    
    void Start()
    {
        controller = GetComponent<CharacterController>();
        animator = GetComponent<Animator>();
    }
    
    void Update()
    {
        // Ground check
        isGrounded = controller.isGrounded;
        
        // Get input
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;
        
        if (direction.magnitude >= 0.1f)
        {
            // Calculate movement direction relative to camera
            float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref rotationSpeed, 0.1f);
            transform.rotation = Quaternion.Euler(0f, angle, 0f);
            
            Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
            
            // Sprint
            float speed = Input.GetKey(KeyCode.LeftShift) ? sprintSpeed : moveSpeed;
            
            // Move
            controller.Move(moveDir.normalized * speed * Time.deltaTime);
            
            // Animate
            animator.SetFloat("Speed", direction.magnitude * speed);
        }
        else
        {
            animator.SetFloat("Speed", 0f);
        }
        
        // Gravity
        if (!isGrounded)
        {
            velocity.y += Physics.gravity.y * Time.deltaTime;
        }
        else
        {
            velocity.y = -2f;
        }
        
        controller.Move(velocity * Time.deltaTime);
    }
}

---

// Enemy AI (Simple Chase)
public class EnemyAI : MonoBehaviour
{
    [SerializeField] private Transform player;
    [SerializeField] private float chaseSpeed = 3f;
    [SerializeField] private float attackRange = 2f;
    [SerializeField] private int damage = 10;
    
    private UnityEngine.AI.NavMeshAgent agent;
    private Animator animator;
    private float attackCooldown = 0f;
    
    void Start()
    {
        agent = GetComponent<UnityEngine.AI.NavMeshAgent>();
        animator = GetComponent<Animator>();
    }
    
    void Update()
    {
        float distanceToPlayer = Vector3.Distance(transform.position, player.position);
        
        if (distanceToPlayer <= attackRange)
        {
            // Stop and attack
            agent.isStopped = true;
            AttackPlayer();
        }
        else
        {
            // Chase player
            agent.isStopped = false;
            agent.SetDestination(player.position);
            animator.SetBool("IsWalking", true);
        }
        
        attackCooldown -= Time.deltaTime;
    }
    
    void AttackPlayer()
    {
        animator.SetBool("IsWalking", false);
        
        if (attackCooldown <= 0f)
        {
            animator.SetTrigger("Attack");
            
            // Deal damage
            PlayerHealth playerHealth = player.GetComponent<PlayerHealth>();
            if (playerHealth != null)
            {
                playerHealth.TakeDamage(damage);
            }
            
            attackCooldown = 2f; // Attack every 2 seconds
        }
    }
}

---

// Health System
public class PlayerHealth : MonoBehaviour
{
    [SerializeField] private int maxHealth = 100;
    private int currentHealth;
    
    void Start()
    {
        currentHealth = maxHealth;
        UIManager.Instance.UpdateHealthBar(currentHealth, maxHealth);
    }
    
    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        currentHealth = Mathf.Max(currentHealth, 0);
        
        // Update UI
        UIManager.Instance.UpdateHealthBar(currentHealth, maxHealth);
        
        // Play damage animation
        GetComponent<Animator>().SetTrigger("Hit");
        
        // Check death
        if (currentHealth <= 0)
        {
            Die();
        }
    }
    
    public void Heal(int amount)
    {
        currentHealth += amount;
        currentHealth = Mathf.Min(currentHealth, maxHealth);
        UIManager.Instance.UpdateHealthBar(currentHealth, maxHealth);
    }
    
    void Die()
    {
        GetComponent<Animator>().SetTrigger("Death");
        
        // Disable player control
        GetComponent<ThirdPersonController>().enabled = false;
        
        // Game over
        GameManager.Instance.GameOver();
    }
}
```

---

## UI & Menus

```csharp
// UI Manager
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }
    
    [Header("HUD")]
    [SerializeField] private TextMeshProUGUI scoreText;
    [SerializeField] private TextMeshProUGUI livesText;
    [SerializeField] private Slider healthBar;
    
    [Header("Menus")]
    [SerializeField] private GameObject pauseMenu;
    [SerializeField] private GameObject gameOverMenu;
    
    void Awake()
    {
        Instance = this;
    }
    
    public void UpdateScore(int score)
    {
        scoreText.text = "Score: " + score;
    }
    
    public void UpdateLives(int lives)
    {
        livesText.text = "Lives: " + lives;
    }
    
    public void UpdateHealthBar(int current, int max)
    {
        healthBar.value = (float)current / max;
    }
    
    public void ShowPauseMenu()
    {
        pauseMenu.SetActive(true);
        Time.timeScale = 0;
    }
    
    public void HidePauseMenu()
    {
        pauseMenu.SetActive(false);
        Time.timeScale = 1;
    }
    
    public void ShowGameOver()
    {
        gameOverMenu.SetActive(true);
    }
}

---

// Main Menu
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    public void PlayGame()
    {
        SceneManager.LoadScene("Level1");
    }
    
    public void OpenSettings()
    {
        // Load settings scene or panel
        SceneManager.LoadScene("Settings");
    }
    
    public void QuitGame()
    {
        Application.Quit();
        
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #endif
    }
}
```

---

## Audio

```csharp
// Audio Manager
using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class Sound
{
    public string name;
    public AudioClip clip;
    [Range(0f, 1f)] public float volume = 1f;
    [Range(0.1f, 3f)] public float pitch = 1f;
    public bool loop = false;
    
    [HideInInspector] public AudioSource source;
}

public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }
    
    [SerializeField] private Sound[] sounds;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
            return;
        }
        
        foreach (Sound s in sounds)
        {
            s.source = gameObject.AddComponent<AudioSource>();
            s.source.clip = s.clip;
            s.source.volume = s.volume;
            s.source.pitch = s.pitch;
            s.source.loop = s.loop;
        }
    }
    
    public void PlaySound(string name)
    {
        Sound s = System.Array.Find(sounds, sound => sound.name == name);
        if (s == null)
        {
            Debug.LogWarning("Sound: " + name + " not found!");
            return;
        }
        s.source.Play();
    }
    
    public void StopSound(string name)
    {
        Sound s = System.Array.Find(sounds, sound => sound.name == name);
        if (s != null)
        {
            s.source.Stop();
        }
    }
}

// Usage:
// AudioManager.Instance.PlaySound("Jump");
// AudioManager.Instance.PlaySound("Explosion");
```

---

## Save System

```csharp
// Save Data (PlayerPrefs - simple)
public class SaveSystem : MonoBehaviour
{
    public static void SavePlayer(PlayerData data)
    {
        PlayerPrefs.SetInt("HighScore", data.highScore);
        PlayerPrefs.SetInt("Level", data.level);
        PlayerPrefs.SetString("PlayerName", data.playerName);
        PlayerPrefs.Save();
    }
    
    public static PlayerData LoadPlayer()
    {
        PlayerData data = new PlayerData();
        data.highScore = PlayerPrefs.GetInt("HighScore", 0);
        data.level = PlayerPrefs.GetInt("Level", 1);
        data.playerName = PlayerPrefs.GetString("PlayerName", "Player");
        return data;
    }
}

[System.Serializable]
public class PlayerData
{
    public int highScore;
    public int level;
    public string playerName;
}

---

// Save Data (JSON - advanced)
using System.IO;

public class SaveSystemJSON
{
    private static string SavePath => Application.persistentDataPath + "/save.json";
    
    public static void SavePlayer(PlayerData data)
    {
        string json = JsonUtility.ToJson(data, true);
        File.WriteAllText(SavePath, json);
    }
    
    public static PlayerData LoadPlayer()
    {
        if (File.Exists(SavePath))
        {
            string json = File.ReadAllText(SavePath);
            return JsonUtility.FromJson<PlayerData>(json);
        }
        else
        {
            return new PlayerData();
        }
    }
}
```

---

## Game Design Principles

```markdown
CORE LOOP:

EXAMPLE (Puzzle game):
1. See puzzle
2. Solve puzzle
3. Get reward (points, unlock next level)
4. Repeat (harder puzzle)

EXAMPLE (RPG):
1. Fight enemies
2. Gain XP
3. Level up (stronger)
4. Fight harder enemies

ENGAGEMENT:
- Loop should be FUN (intrinsically rewarding)
- Short loop (5-30 seconds): Immediate feedback
- Long loop (hours): Progression, unlocks

---

DIFFICULTY CURVE:

PROGRESSION:
Level 1: Easy (tutorial, learn mechanics)
Level 2-3: Medium (practice)
Level 4-5: Hard (mastery)
Boss: Very Hard (test all skills)

FLOW STATE:
- Too easy → Boring
- Too hard → Frustration
- Just right → Flow (engaged, challenged)

ADAPTIVE DIFFICULTY:
- If player dies 3× → Offer "easy mode"
- If player breezes through → Increase challenge

---

JUICE (Game Feel):

SCREEN SHAKE:
- Player hits enemy → Camera shakes slightly
- Explosion → Big shake
- Makes impact feel powerful

PARTICLES:
- Coins: Sparkle effect
- Hit: Blood/sparks
- Power-up: Glow

SOUND EFFECTS:
- Jump: "Boing!"
- Collect: "Ding!"
- Hit: "Thud!"

ANIMATIONS:
- Character squash & stretch (cartoon physics)
- Anticipation before jump (crouch)
- Follow-through after landing

RESULT: Game feels responsive, satisfying

---

PLAYER FEEDBACK:

VISUAL:
- Health bar (how much HP left?)
- Damage numbers (how much damage dealt?)
- Minimap (where am I?)

AUDIO:
- Low health: Heartbeat sound
- Power-up: Triumphant music
- Enemy nearby: Tense music

HAPTIC:
- Controller vibration (hit, explosion)

CLARITY:
- Player should always know:
  * Goal (what am I trying to do?)
  * Progress (how close am I?)
  * Feedback (what just happened?)
```

---

## Optimization

```markdown
PERFORMANCE:

OBJECT POOLING:
- Don't Instantiate/Destroy (slow)
- Pre-create pool of objects
- Activate/deactivate (fast)

Example: Bullets
- Create 100 bullets at start (inactive)
- When shoot: Activate one, position it
- When bullet off-screen: Deactivate, return to pool

DRAW CALLS:
- Combine meshes (batching)
- Use sprite atlases (one texture, many sprites)
- Occlusion culling (don't render what's behind walls)

PHYSICS:
- Use layers (Physics Matrix: which layers collide)
- Simplify colliders (box > mesh collider)
- Fixed Timestep: 0.02 (50 updates/sec, not 60)

MOBILE:
- Reduce texture size (2048×2048 → 1024×1024)
- Fewer draw calls (<100 for mobile)
- Simple shaders (no complex lighting)

PROFILER:
- Unity Profiler (Window > Analysis > Profiler)
- CPU: Where is time spent?
- GPU: Rendering bottleneck?
- Memory: Leaks, large allocations?
```

---

## Publishing

```markdown
PLATFORMS:

PC (Steam):
- Build for Windows, Mac, Linux
- Steamworks SDK (achievements, cloud saves)
- $100 fee per game

MOBILE (iOS, Android):
- Build settings: Target platform
- Optimize for touch controls
- In-app purchases (Unity IAP)
- Apple: $99/year, Google: $25 one-time

CONSOLES:
- Apply to developer program (Nintendo, Sony, Xbox)
- Requires devkit (special hardware)
- Certification process (strict requirements)

WEB (WebGL):
- Build for WebGL
- Host on itch.io, Newgrounds, your site
- Smaller file size (compress assets)

---

MONETIZATION:

PREMIUM (Pay once):
- $0.99 - $60 (depending on scope)
- No ads, full game
- Lower revenue but premium feel

FREE-TO-PLAY (F2P):
- Ads (Unity Ads, AdMob)
- In-app purchases (cosmetics, power-ups)
- Higher revenue potential (but can feel exploitative)

BATTLE PASS:
- Season pass ($10)
- Unlock cosmetics by playing
- Encourages retention

---

MARKETING:

TRAILER:
- 30-60 seconds
- Show gameplay (not just cutscenes)
- Hook in first 5 seconds

SOCIAL MEDIA:
- Twitter: GIFs of gameplay
- TikTok: Short clips
- Discord: Community

PRESS KIT:
- Logo, screenshots, trailer
- Description, key features
- presskit.it (template)

DEMO:
- Free demo (first 3 levels)
- Convert to full game
- Steam Next Fest (demo events)
```

---

## Key Takeaways

1. **Prototype fast** - Test ideas, fail quickly
2. **Juice** - Polish makes games feel good
3. **Playtesting** - Watch players, iterate
4. **Scope small** - Finish small game > abandon huge game
5. **Have fun** - If you're not enjoying it, neither will players

---

## References

- Unity Learn (tutorials)
- Brackeys (YouTube)
- "The Art of Game Design" - Jesse Schell

**Related**: `unity-advanced.md`, `game-design-patterns.md`, `mobile-optimization.md`
