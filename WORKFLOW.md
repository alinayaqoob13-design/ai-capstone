# Vague vs. Precise AI Prompting Workflow

## 1. Feature Description

This exercise compared two AI-assisted approaches to building the same feature: a **settings form component** with name, email, and password fields. The form needed client-side validation, accessible markup, disabled submit until valid, and automated tests. The same AI tool was used on two branches; only prompt specificity differed.

---

## 2. Branch 1: `settings-form-vague`

**Prompt used:**

> Create a settings form component with name, email, and password fields with validation.

**What AI produced:** A basic form with three inputs and minimal validation. Fields used placeholders instead of labels. Submit stayed enabled regardless of input state. No tests were generated.

**Problems found:**

| Issue | Detail |
|-------|--------|
| Validation | Empty checks only; no format or strength rules |
| Error messages | None |
| Accessibility | No labels, `htmlFor`, `aria-describedby`, or focus management |
| Submit button | Always enabled |
| Tests | None |
| Password field | `type="text"` instead of `type="password"` |
| Edge cases | Spaces-only strings passed validation |
| Review time | ~2 hours of manual fixes |

---

## 3. Branch 2: `settings-form-precise`

**Prompt summary:** Detailed spec with file paths, field rules (name min 2 chars; email regex; password min 8 chars with 1 uppercase and 1 number), validation on blur with specific error messages, disabled submit until valid, accessibility (labels, `htmlFor`, `aria-describedby`, focus on first invalid field), and explicit test requirement.

**What AI produced:** Production-ready form with full validation, accessible markup, and four passing Vitest tests.

**Comparison: Vague vs. Precise**

| Dimension | Vague | Precise |
|-----------|-------|---------|
| Validation | Empty checks only | Min length, email regex, password strength |
| Error messages | None | Per-field messages on blur |
| Accessibility | Placeholders only | Labels, ARIA, focus management |
| Submit button | Always enabled | Disabled until valid |
| Tests | None | 4 passing tests |
| Password field type | `type="text"` | `type="password"` |
| Edge cases | Spaces-only accepted | Trim and strength rules enforced |
| Review time | ~2 hours of fixes | Minimal review; ready to merge |

---

## 4. AI Mistake I Caught

On the vague branch, the AI set the password input to `type="text"`, exposing the password in plain view—a security and UX defect easy to miss in a quick review. The precise prompt explicitly required `type="password"`, which the AI implemented correctly on the first pass. Security-sensitive details must be stated in the prompt, not assumed.

---

## 5. Key Lesson

Vague prompts produce plausible code that fails on validation, accessibility, security, and tests. Precise prompts—specifying file paths, constraints, UX behavior, accessibility, and verification—shift the AI from guessing to implementing against a contract. **Constraints plus verification produce code you can ship.**
