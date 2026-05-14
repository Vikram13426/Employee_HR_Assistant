<!-- ```markdown -->
# Transformer Decoder — Complete Step-by-Step Explanation

## What Encoder Does

**Encoder’s job**: Understand the input sentence deeply.

**Example input:**
```text
"I love AI"
```

The Encoder processes all words and creates rich contextual vectors.

Suppose encoder outputs:

```text
E1 ("I")   = [0.5, 1.2]
E2 ("love")= [1.4, 0.7]
E3 ("AI")  = [2.0, 1.1]
```

These are **context-rich representations** of the input sentence.  
The Decoder will use these vectors.

---

## Decoder Task

**Translation Example:**

- **Input (English)**: "I love AI"
- **Expected Output (French)**: "J'aime l'IA"

---

## IMPORTANT DECODER IDEA

The Decoder generates **one word at a time**.

### During Training (Teacher Forcing)

Decoder input is **shifted right**:

- **Decoder Input**: `<START> J'aime l'`
- **Target Output**: `J'aime l'IA`

This forces the decoder to learn to predict the **next word**.

---

## DECODER ARCHITECTURE

Each Decoder block contains:

1. **Masked Multi-Head Self Attention**
2. **Add & Norm**
3. **Cross Attention** (with Encoder)
4. **Add & Norm**
5. **Feed Forward Network**
6. **Add & Norm**

---

## STEP 1 — MASKED SELF ATTENTION

When the decoder has:
```text
<START> J'aime
```
and wants to predict the next word.

### Why Masking?

The decoder must **NOT see future words** (no cheating during training).

### Mask Example (for length = 4)

```text
1 0 0 0
1 1 0 0
1 1 1 0
1 1 1 1
```

**Rule**: Each word can only attend to itself and previous words.

---

## STEP 2 — ADD & NORMALIZATION

```text
Output = LayerNorm(x + Attention(x))
```

Helps stabilize training and preserves information flow.

---

## STEP 3 — CROSS ATTENTION (Most Important)

This is the key link between Encoder and Decoder.

| Component     | Comes From     |
|---------------|----------------|
| **Query (Q)** | Decoder        |
| **Key (K)**   | Encoder        |
| **Value (V)** | Encoder        |

### Why Cross Attention?

The Decoder asks: *"Which words from the input sentence are important right now for predicting the next output word?"*

**Example**: While generating "l'", the decoder strongly attends to encoder representation of **"love"**.

**Formula** (same as self-attention):
$$
\text{Attention}(Q, K, V) = \text{Softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Only difference: **Q comes from decoder**, **K & V come from encoder**.

---

## STEP 4 — FEED FORWARD NETWORK

```text
Linear → ReLU → Linear
```

Learns complex non-linear patterns.

---

## STEP 5 — LINEAR LAYER (Vocabulary Projection)

Takes the final hidden vector and projects it to **vocabulary size**.

**Example**:
- Hidden vector: `[2.1, 1.4, 0.3]`
- Vocabulary: `["IA", "chat", "code"]`
- Logits: `[5.2, 1.1, 0.3]`

---

## STEP 6 — SOFTMAX

Converts logits into probabilities:

```text
[5.2, 1.1, 0.3]  →  [0.93, 0.05, 0.02]
```

**"IA" has 93% probability**

---

## STEP 7 — OUTPUT TOKEN

Select the highest probability word → **"IA"**

Then append it to the generated sequence and repeat the process until `<END>` token is produced.

---

## ENTIRE TRANSFORMER FLOW

```text
INPUT SENTENCE
        ↓
   Embedding + Positional Encoding
        ↓
     ENCODER
        ↓
   Rich Context Vectors
        ↓
   ─────────────────────
        ↓
   DECODER INPUT (<START>)
        ↓
   Masked Self Attention
        ↓
   Cross Attention (with Encoder)
        ↓
   Feed Forward Network
        ↓
   Linear Layer → Softmax
        ↓
   Predict Next Word
        ↓
   Repeat until <END> token
```

---

## KEY DIFFERENCES

| Aspect                    | Encoder (Self-Attention)       | Decoder (Masked Self-Attention) |
|--------------------------|--------------------------------|---------------------------------|
| What can it see?         | All words                      | Only previous words             |
| Source of Q, K, V        | All from Encoder               | All from Decoder                |

### Cross Attention Summary

| Component | Source   |
|-----------|----------|
| Query     | Decoder  |
| Key       | Encoder  |
| Value     | Encoder  |

---

## FINAL INTUITION

- **Encoder**: *"What does this input sentence mean?"*
- **Decoder**: *"What should the next output word be, given what I've generated so far and the input meaning?"*

The Decoder continuously combines:
1. Previously generated words (via Masked Self-Attention)
2. Source sentence understanding (via Cross-Attention)
3. Predicts next token

This is how Transformers perform tasks like **Translation, Summarization, Code Generation**, etc.

---

**That is the complete working of the Transformer Decoder.**
```
