# Sovryn Guardian UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/97f189de-85e0-4d0c-9696-a8f96bcf66c5/deploy-status)](https://app.netlify.com/sites/sovryn-guard/deploys)


Gnosis safe sdk: https://safe-global.github.io/safe-core-sdk/



# Usage

## 1. Connect to safe

Connect to safe using your wallet

## 2. Create a new transaction

Use checkboxes to select modules you want disable or enable, "Propose & Approve" button will light up when you select at least one module.

Click "Propose & Approve" button to create a new transaction and sign it.

## 3. Download proposal file

Once signed, you will see a download button, click it to download a proposal file.
Share this file with other guardians.

You will also see transaction content and hash used to verify the proposal.

## 4. Approve proposal

Other guardians need to open guardian website, connect to safe and open "Sign" page.

They then need to upload the proposal file.

Once uploaded, they will see transaction hash and who already signed it.

They can then click "Approve" / "Approve & Execute" or "Execute" button to sign / execute the transaction.

## 5. Execute proposal

In most cases, last approver will execute the transaction (they will see "Approve & Execute" button). But if it was not executed, you will see "Execute" button once there is enought signers.

## 6. !!!!!Verify execution!!!!!!

After execution, guardian website DOES NOT indicate it was executed or that last approval happened!
Check it manually by opening transaction hash in explorer and checking for the events!

