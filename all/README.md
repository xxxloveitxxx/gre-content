# Replyze Admin Forge

Internal growth tool for the Replyze AI team. This application uses the Alex Hormozi growth frameworks to generate high-leverage social media content and marketing assets specifically targeting Real Estate Agents.

## 🚀 How to move this to GitHub

Follow these steps to get your code onto your own GitHub repository:

### 1. Download the Project
In the Firebase Studio interface, look for the **Download** (zip icon) in the top navigation bar. This will package your entire project into a `.zip` file.

### 2. Prepare Locally
1. Unzip the downloaded file on your computer.
2. Open your terminal or command prompt.
3. Navigate into the project folder: `cd nextn` (or whatever the folder is named).

### 3. Initialize Git & Push to GitHub
1. **Initialize Git:**
   ```bash
   git init
   ```
2. **Add Files:**
   ```bash
   git add .
   ```
3. **Commit:**
   ```bash
   git commit -m "Initial commit of Replyze Admin Forge"
   ```
4. **Create a Repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Name it `replyze-admin-forge`.
   - Click "Create repository".
5. **Link and Push:**
   - Copy the "remote" URL provided by GitHub (e.g., `https://github.com/your-username/replyze-admin-forge.git`).
   - Run these commands in your terminal:
   ```bash
   git remote add origin <YOUR_GITHUB_URL>
   git branch -M main
   git push -u origin main
   ```

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **AI Engine:** Genkit with Google Gemini 2.5 Flash
- **Image Generation:** Google Imagen 4.0
- **UI Components:** ShadCN UI & Tailwind CSS
- **Frameworks:** Hormozi Value Equation, Hook-Story-Offer

## 🔐 Environment Variables
When deploying to Vercel or your own server, ensure you set your `GOOGLE_GENAI_API_KEY` in the environment variables to keep the AI engine running.
