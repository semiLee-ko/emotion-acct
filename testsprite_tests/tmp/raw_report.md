
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** emotion-acct
- **Date:** 2025-12-21
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Automatic Authentication via Toss SDK
- **Test Code:** [TC001_Automatic_Authentication_via_Toss_SDK.py](./TC001_Automatic_Authentication_via_Toss_SDK.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/68ddad10-543c-4abd-8056-618615172dbf
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Add New Emotion-Tagged Receipt
- **Test Code:** [TC002_Add_New_Emotion_Tagged_Receipt.py](./TC002_Add_New_Emotion_Tagged_Receipt.py)
- **Test Error:** The user was able to open the Add Receipt modal and select emotions multiple times. However, the process to input the numeric amount, enter a memo, and save the receipt was not completed due to UI navigation issues preventing access to the amount input screen. Consequently, the receipt was not saved, and no confirmation of data saved to Firestore was observed. The modal did not close automatically, and the receipt feed did not update with a new receipt. Therefore, the task to verify successful addition of a new spending receipt with amount, emotion, and optional memo is incomplete.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/98cc8c30-6781-40d7-9ed1-add610b7299f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Receipt Feed Infinite Scroll Loading
- **Test Code:** [TC003_Receipt_Feed_Infinite_Scroll_Loading.py](./TC003_Receipt_Feed_Infinite_Scroll_Loading.py)
- **Test Error:** The receipt feed was accessed and attempts were made multiple times to add receipts by selecting emotions in the modal. However, the receipt addition process was not completed successfully, so no receipts were added to the feed. Therefore, it was not possible to verify that receipts load in descending date order or that infinite scroll loads older receipts. The feed remains empty with a message prompting to add receipts. Task is incomplete due to lack of data to verify the requirements.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/6f6be50e-721e-4fe5-adba-e2ebd32c2c7c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Delete Receipt with Animation and Sound
- **Test Code:** [TC004_Delete_Receipt_with_Animation_and_Sound.py](./TC004_Delete_Receipt_with_Animation_and_Sound.py)
- **Test Error:** Unable to add a receipt to the feed to test deletion. The UI consistently shows no registered receipts despite attempts to add one. Therefore, the deletion test cannot be completed as no receipt is available to swipe or long-press for deletion. Task ended without success.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/a3310eca-e43b-4c28-a173-e5cb46ff79d3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Statistics Dashboard Monthly Summary Display
- **Test Code:** [TC005_Statistics_Dashboard_Monthly_Summary_Display.py](./TC005_Statistics_Dashboard_Monthly_Summary_Display.py)
- **Test Error:** Stopped testing due to unexpected popup blocking access to the statistics dashboard. Cannot proceed with verification of total expenditure, emotional breakdown donut charts, mood thermometer, and insight messages.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/0d06c40a-12aa-484e-ac5b-79e3f4920387
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Image Capture and Native Sharing Functionality
- **Test Code:** [TC006_Image_Capture_and_Native_Sharing_Functionality.py](./TC006_Image_Capture_and_Native_Sharing_Functionality.py)
- **Test Error:** The app was navigated through the statistics dashboard and receipt entry flow, including multiple emotion selections and amount input. However, the critical steps to trigger image capture via html2canvas and to invoke the native sharing dialog on mobile devices were not reached or verified. Therefore, the task to verify capturing the dashboard or receipt views as images and sharing them successfully through native dialogs is incomplete.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/dbbce8ed-293c-4ffa-909f-67ecc7e066a2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Input Modal Validation and Limits
- **Test Code:** [TC007_Input_Modal_Validation_and_Limits.py](./TC007_Input_Modal_Validation_and_Limits.py)
- **Test Error:** The Add Receipt modal opens correctly and allows emotion selection, but the amount and memo input fields required for input validation testing do not appear in the modal flow. Attempts to progress through the modal steps only cycle through emotion selections or reset the modal without showing these fields. Therefore, it was not possible to verify that the amount field accepts only numeric input, that the memo is limited to 20 characters, or that an emotion must be selected before saving. The save button or error messages related to these validations were not encountered. The task is incomplete due to the UI flow limitations observed.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] Failed to load resource: net::ERR_CONNECTION_CLOSED (at https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel?gsessionid=OT66VKRgfU-enioLvVNPxMbBmx8_COPi1Xt8hZ6LBKE&VER=8&database=projects%2Fmiracle-3min%2Fdatabases%2F(default)&RID=rpc&SID=lTvnX96Bse9uFxAHLIDBjQ&AID=0&CI=0&TYPE=xmlhttp&zx=5ha9f723nzb9&t=1:0:0)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/8fe6c66e-3dcc-40e4-b029-dcb3ff907c8a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Daily Limit Enforcement on Adding Receipts
- **Test Code:** [TC008_Daily_Limit_Enforcement_on_Adding_Receipts.py](./TC008_Daily_Limit_Enforcement_on_Adding_Receipts.py)
- **Test Error:** Tested the daily limit enforcement for adding receipts. The app failed to prevent adding more receipts after reaching the limit of 1. No error or info message was displayed. The issue is reported and testing is stopped.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/dafd434b-7511-4f17-944a-05005753ca6d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** UI Responsiveness and Visual Correctness on Mobile WebView
- **Test Code:** [TC009_UI_Responsiveness_and_Visual_Correctness_on_Mobile_WebView.py](./TC009_UI_Responsiveness_and_Visual_Correctness_on_Mobile_WebView.py)
- **Test Error:** Testing stopped due to the app being stuck on a loading spinner with no UI elements visible. Receipt feed, modal inputs, statistics dashboard, and animations could not be verified. Please investigate the loading issue to proceed with testing.
Browser Console Logs:
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[ERROR] ⚠️ Toss Login failed, falling back to anonymous: Error: Skipping server login in local environment
    at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:34:17 (at http://localhost:5173/src/lib/firebase.ts?t=1766304934155:49:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
[WARNING] [TossSDK] Not in Toss App environment, using Mock. (at http://localhost:5173/src/lib/toss-sdk.ts?t=1766301949270:24:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/319c3009-8f9b-4c99-a368-57eb76e1e8ae
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Firestore CRUD Operations Integrity
- **Test Code:** [TC010_Firestore_CRUD_Operations_Integrity.py](./TC010_Firestore_CRUD_Operations_Integrity.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1db966f8-107c-487d-ac1c-a4477851d93e/32b6cc75-a344-4fbf-bdb2-7e58f76b0b0a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **20.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---