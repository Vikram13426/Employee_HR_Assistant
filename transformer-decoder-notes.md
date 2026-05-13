````md id="7mtnzk"
# Transformer Decoder — Complete Step-by-Step Explanation

# WHAT ENCODER DOES

Encoder’s job:

> Understand the input sentence deeply.

Example input:

```text id="9sjq9k"
"I love AI"
````

Encoder processes all words and creates rich contextual vectors.

Suppose encoder output becomes:

```text id="u1q9mc"
E1 = [0.5, 1.2]
E2 = [1.4, 0.7]
E3 = [2.0, 1.1]
```

These are NOT words anymore.

These are:

> context-rich representations

The decoder will use these vectors.

---

# NOW DECODER STARTS

Suppose translation task:

```text id="2zc0wl"
English → French
```

Input:

```text id="2q4qvy"
"I love AI"
```

Expected output:

```text id="wni9dr"
"J'aime l'IA"
```

---

# IMPORTANT DECODER IDEA

Decoder generates:

> ONE WORD AT A TIME

---

# DURING TRAINING

Decoder input is shifted right.

Example:

## Decoder Input

```text id="jqx2oe"
<START> J'aime l'
```

## Target Output

```text id="0e1b0t"
J'aime l'IA
```

---

# WHY SHIFTED RIGHT?

Because decoder predicts:

> next word

---

# EXAMPLE

| Decoder Input       | Expected Output |
| ------------------- | --------------- |
| `<START>`           | `J'aime`        |
| `<START> J'aime`    | `l'`            |
| `<START> J'aime l'` | `IA`            |

---

# DECODER ARCHITECTURE

Each decoder block contains:

1. Masked Multi-Head Attention
2. Add & Norm
3. Cross Attention
4. Add & Norm
5. Feed Forward Network
6. Add & Norm

Now let’s go one by one.

---

# STEP 1 — MASKED SELF ATTENTION

Suppose decoder currently has:

```text id="8u2f2o"
<START> J'aime
```

and wants to predict the next word.

---

# WHY MASKING?

The decoder must NOT see future words.

Wrong example:

```text id="4d2hlq"
<START> J'aime l' IA
```

If model sees future words:

* cheating happens
* training becomes meaningless

---

# MASK MATRIX

Suppose sentence length = 4

Mask matrix:

```text id="4jlln2"
1 0 0 0
1 1 0 0
1 1 1 0
1 1 1 1
```

Meaning:

> current word can only see previous words

---

# DECODER SELF-ATTENTION FLOW

Same as encoder:

```text id="w7ahri"
Embeddings
 ↓
Q,K,V creation
 ↓
Attention scores
 ↓
Apply mask
 ↓
Softmax
 ↓
Weighted Values
```

---

# IMPORTANT DIFFERENCE

## Encoder Attention

```text id="r0jlwm"
Every word sees every word
```

## Decoder Masked Attention

```text id="v8shls"
Word sees only previous words
```

---

# SIMPLE EXAMPLE

Suppose decoder input:

```text id="zlxmiv"
<START> J'aime
```

When predicting next word:

* “J'aime” can see `<START>`
* but cannot see future word `l'`

That is masking.

---

# STEP 2 — ADD & NORMALIZATION

Same as encoder.

Formula:

```text id="0uqqva"
Output = LayerNorm(x + Attention(x))
```

Why?

* stabilizes training
* preserves original information

---

# STEP 3 — CROSS ATTENTION (MOST IMPORTANT)

This is the special decoder part.

Now decoder looks at:

> encoder outputs

---

# WHY?

Decoder needs source sentence meaning.

Example input sentence:

```text id="3r3z7g"
"I love AI"
```

Decoder generating:

```text id="4x69h9"
"J'aime ..."
```

To predict next French word correctly,
decoder must look back at encoder understanding.

---

# CROSS ATTENTION FLOW

| Component | Comes From |
| --------- | ---------- |
| Query (Q) | Decoder    |
| Key (K)   | Encoder    |
| Value (V) | Encoder    |

---

# VERY IMPORTANT UNDERSTANDING

## In encoder self-attention:

```text id="avt7ku"
Q,K,V all come from encoder
```

## In cross attention:

```text id="4r2x8u"
Q comes from decoder
K,V come from encoder
```

---

# WHY?

Decoder asks:

> “Which input words are important for predicting next output word?”

---

# SIMPLE EXAMPLE

Input:

```text id="hj31o3"
"I love AI"
```

Current decoder word:

```text id="zyy79x"
"J'aime"
```

Decoder Query may strongly match:

> encoder representation of “love”

So attention score becomes high there.

---

# CROSS ATTENTION MATH

Same formula:

\mathrm{Attention}(Q,K,V)=\mathrm{Softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V

Only difference:

* Q from decoder
* K,V from encoder

---

# STEP 4 — FEED FORWARD NETWORK

After attention:

```text id="r09jtx"
Linear
 ↓
ReLU
 ↓
Linear
```

This learns complex patterns.

---

# STEP 5 — LINEAR LAYER

Now decoder has final vector.

Example:

```text id="s5g6bf"
[2.1, 1.4, 0.3]
```

Linear layer converts vector size into:

> vocabulary size

Suppose vocabulary has:

```text id="zpb0hf"
["IA", "chat", "code"]
```

Linear output:

```text id="z07rt4"
[5.2, 1.1, 0.3]
```

These are logits.

---

# WHAT ARE LOGITS?

> Raw prediction scores

Higher score means:

> more likely word

---

# STEP 6 — SOFTMAX

Softmax converts logits into probabilities.

Input:

```text id="y29cjr"
[5.2, 1.1, 0.3]
```

Output:

```text id="b3aq1m"
[0.93, 0.05, 0.02]
```

Meaning:

> “IA” has 93% probability

---

# STEP 7 — OUTPUT TOKEN

Highest probability word selected:

```text id="pd4b0l"
"IA"
```

Now generated sentence becomes:

```text id="w8ed5d"
"J'aime l'IA"
```

---

# THEN PROCESS REPEATS

Decoder now feeds output back again.

Loop:

```text id="5u1r6o"
Generated word
 ↓
Added to decoder input
 ↓
Masked attention
 ↓
Cross attention
 ↓
Linear
 ↓
Softmax
 ↓
Next word
```

until:

```text id="kt4f5n"
<END>
```

token appears.

---

# ENTIRE TRANSFORMER FLOW TOGETHER

```text id="x42it4"
INPUT SENTENCE
 ↓
Embedding
 ↓
Positional Encoding
 ↓
ENCODER SELF ATTENTION
 ↓
Encoder Context Vectors
 ↓
--------------------------------
 ↓
Decoder Input (<START>)
 ↓
Masked Self Attention
 ↓
Cross Attention with Encoder Output
 ↓
Feed Forward Network
 ↓
Linear Layer
 ↓
Softmax
 ↓
Predict Next Word
 ↓
Repeat until END token
```

---

# GOLDEN UNDERSTANDING

## Encoder

> understands input

## Decoder

> generates output using:

* previous outputs
* encoder meaning

---

# MOST IMPORTANT DIFFERENCES

| Encoder Attention  | Decoder Masked Attention |
| ------------------ | ------------------------ |
| sees all words     | sees only past words     |
| Q,K,V from encoder | Q,K,V from decoder       |

---

# CROSS ATTENTION SUMMARY

| Component | Source  |
| --------- | ------- |
| Q         | Decoder |
| K         | Encoder |
| V         | Encoder |

---

# FINAL INTUITION

## Encoder

```text id="7u6g52"
“What does this sentence mean?”
```

## Decoder

```text id="sqmb9z"
“What should the next output word be?”
```

The decoder continuously:

1. looks at previously generated words
2. looks at encoder understanding
3. predicts the next token
4. repeats until sentence completion

That is the complete working of the Transformer decoder.

```
```
