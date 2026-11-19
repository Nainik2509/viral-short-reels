# Script formula - hook-first, punchy

Source: the project's measured profile (`../../STYLE_PROFILE.md`): zero pre-roll, claim in sentence 1, a turn line within ~5 s, 3-5 beats,
payoff. This file turns it into a writing recipe for 3D character shorts. **The script is the product; the 3D is how it is shown.**

## Length and speed
55-70 s at ~3.7 words/s = **205-260 words** (35-45 s = 130-165 words). Count words before approving. Spoken plain English (or Hindi), contractions,
~13 words per sentence median, no jargon unless the next clause explains it. Read it aloud once: if you run out of breath, split the sentence.

## Beat sheet (60 s, ~230 words)
| # | Beat | Time | Words | Job | Visual |
|---|---|---|---|---|---|
| 1 | **HOOK** | 0-4 s | 10-16 | The paradox/claim, no setup. The viewer decides here. | Literal picture of the claim, face or object huge in frame, hook text in top safe zone |
| 2 | **Echo / turn** | 3-6 s | 3-12 | Deadpan repeat or "But there's a catch." | Hard cut + kick, tighter close-up |
| 3 | **Setting** | 6-12 s | 25-40 | Where/when/who, present tense, concrete named everyman, 1-2 numbers | Wide establishing shot, show the world |
| 4 | **Escalation** x3-6 | 12-38 s | 100-130 | Each beat bigger/funnier/more at stake; others doubt or mock (short quoted lines); 1-2 exaggeration jokes | New shot per beat, stamp per beat, light starts to cool |
| 5 | **Mystery** | ~38 s | 6-14 | "Wait, ...?" or a question the viewer wants answered | Whip/cut, cool dark light, shock faces |
| 6 | **Pivot** | 40-52 s | 40-60 | "**You see,**" -> the real mechanism, via an everyday analogy ("Ever pushed a kid on a swing?") | Calm close-ups, props that show the idea, light warms |
| 7 | **Ironic payoff** | last 5 s | 8-18 | Short, lands the twist, **ends on its last word** | Warm payoff two-shot, stamp, confetti, hold last face |

"Luckily..., Unluckily..." double lines and a callback to the hook are the two most reliable payoff shapes.

## Hook bank (fill the blanks; the first sentence must be a fact or claim, never a greeting or a question)
1. **Absurd cause -> big effect:** "Seventy-four soldiers knocked down an iron bridge just by walking across it."
2. **Forbidden/illegal yet true:** "It's illegal to X in Y, yet everyone does it."
3. **If you X, you'd Y:** "If you dropped a coin from this tower, it could kill someone." (use only true claims)
4. **Person did a dumb/impossible thing:** "This man [verb] for [time] because [reason]."
5. **Number shock:** "[N] [things] are hiding inside your [familiar object]."
6. **Reversal:** "The safest seat on the plane is the one nobody wants."
7. **Rule nobody explained:** "Every [professional] does X. Nobody knows why."
8. **Wholesome promise (wholesome genre):** "Every morning for 20 years, he left one thing on her desk."
9. **Comedy setup:** "This man once burned water. Yes, water."
10. **Second person:** "Imagine you're [role] and [absurd situation]."
Test: cover everything after sentence 1 - would a stranger still want to hear sentence 2? If not, rewrite sentence 1.

## Punchy-writing rules
- **Never describe what the viewer already sees.** The picture does the "what"; the voice does the "why" and the joke.
- **One idea per sentence; the funniest word last.** "Step two: way too much sugar." not "Way too much sugar is step two."
- **Escalate in threes** with a visible change each time (more people, higher stakes, bigger prop, worse light).
- **Put doubt in a character's mouth** ("Everyone laughed.") then pay it off.
- **Facts: one source line each** at the top of `script.md`. Real-story shorts need facts that are checkable; jokes are on real details, never invented claims about real people or groups.
- **Callbacks beat new jokes** in the last 10 s: reuse a word/prop from the hook.
- **Cut every word that does not change the picture or the joke.** Aim for 5-10 % under target, not over.
- **Loop-friendly ending (optional):** final line that flows back into the first ("...and that's why he never bakes anymore. This man once burned water.").
- **Comments bait (optional, interactive variant):** end on a choice or a question the audience can answer in one word.
- No self-promotion, "subscribe", or "like" text inside the video.

## Writing for animation (so the 3D can follow)
Mark the script with the cue word for each visual change; `cue(words, "oven")` in code finds the frame:
```
[HOOK]   This man once burned water.            -> shot hook, face smug, pot smoking
[ECHO]   Yes, water.                            -> cut: close-up, kick, dutch tilt
[SET]    Today, he's baking his daughter's pie. -> wide, party kitchen, Flash
[ESC 1]  Step one: confidence.                  -> low angle, STEP 1 stamp
[ESC 2]  Step two: way too much sugar.          -> table close-up, kid worried
[MYST]   Wait, why is the oven smoking?         -> kid shock, light -> tense, oven shot
[PIVOT]  You see, he forgot the plastic.        -> dad sheepish, wrapped pie, light holds cool
[PAY]    Luckily, she loved it anyway.          -> warm light, confetti, 10/10 stamp
```
Reactions land 2-3 frames BEFORE their word; light and set changes land ON the word that causes them.

## Approval template (`script.md`)
Title - slug - language - genre (punchy/wholesome) - facts + sources - hook + visual hook - voice-over numbered by beat - cast table - beat->picture table - word count + estimated seconds - `[ ] approved (date/by)`. Start from `templates/story/script.md`.

## Title, description, hashtags (deliver with the mp4)
Title = the hook sentence trimmed to ~60 chars, no clickbait that the video does not pay off. 3-5 hashtags (#shorts + 2 topical + 1 genre). Put sources in the description for factual stories.
