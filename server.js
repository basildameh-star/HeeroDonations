/* ============================================
   HEERO PAYPAL LINK

   REPLACE THIS ONLY.

   EXAMPLE:
   const PAYPAL_LINK =
   "https://www.paypal.com/ncp/payment/ABC123";

============================================ */

const PAYPAL_LINK =
  "YOUR_PAYPAL_DONATION_LINK";


/* ============================================
   VARIABLES
============================================ */

let selectedAmount = 5;


const amountButtons =
  document.querySelectorAll(
    ".amount-button"
  );


const customAmount =
  document.getElementById(
    "customAmount"
  );


const selectedAmountText =
  document.getElementById(
    "selectedAmount"
  );


const donorName =
  document.getElementById(
    "donorName"
  );


const donorMessage =
  document.getElementById(
    "donorMessage"
  );


const rememberInfo =
  document.getElementById(
    "rememberInfo"
  );


const donateButton =
  document.getElementById(
    "donateButton"
  );


const savedNotice =
  document.getElementById(
    "savedNotice"
  );


const amountNotice =
  document.getElementById(
    "amountNotice"
  );


/* ============================================
   FORMAT MONEY
============================================ */

function formatMoney(
  amount
) {

  return (
    "$" +
    Number(
      amount
    ).toFixed(
      2
    )
  );

}


/* ============================================
   UPDATE AMOUNT
============================================ */

function setAmount(
  amount
) {

  const number =
    Number(
      amount
    );


  if (
    !Number.isFinite(
      number
    )
  ) {

    return;

  }


  if (
    number < 1
  ) {

    return;

  }


  if (
    number > 500
  ) {

    return;

  }


  selectedAmount =
    number;


  selectedAmountText.textContent =
    formatMoney(
      selectedAmount
    );


  saveInformation();

}


/* ============================================
   PRESET BUTTONS
============================================ */

amountButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        amountButtons.forEach(
          otherButton => {

            otherButton.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        customAmount.value =
          "";


        setAmount(
          button.dataset.amount
        );


        amountNotice.textContent =
          "";

      }
    );

  }
);


/* ============================================
   CUSTOM AMOUNT
============================================ */

customAmount.addEventListener(
  "input",
  () => {

    const value =
      Number(
        customAmount.value
      );


    if (
      value >= 1 &&
      value <= 500
    ) {

      amountButtons.forEach(
        button => {

          button.classList.remove(
            "active"
          );

        }
      );


      setAmount(
        value
      );

    }

  }
);


/* ============================================
   SAVE BASIC INFO
============================================ */

function saveInformation() {

  if (
    !rememberInfo.checked
  ) {

    return;

  }


  const information = {

    name:
      donorName.value,

    message:
      donorMessage.value,

    amount:
      selectedAmount

  };


  localStorage.setItem(
    "heeroDonationInfo",
    JSON.stringify(
      information
    )
  );


  savedNotice.style.display =
    "block";

}


/* ============================================
   REMEMBER CHECKBOX
============================================ */

rememberInfo.addEventListener(
  "change",
  () => {

    if (
      rememberInfo.checked
    ) {

      saveInformation();

    }

    else {

      localStorage.removeItem(
        "heeroDonationInfo"
      );


      savedNotice.style.display =
        "none";

    }

  }
);


/* ============================================
   SAVE WHEN TYPING
============================================ */

donorName.addEventListener(
  "input",
  saveInformation
);


donorMessage.addEventListener(
  "input",
  saveInformation
);


/* ============================================
   LOAD SAVED INFO
============================================ */

function loadSavedInformation() {

  try {

    const saved =
      JSON.parse(

        localStorage.getItem(
          "heeroDonationInfo"
        )

      );


    if (
      !saved
    ) {

      return;

    }


    donorName.value =
      saved.name || "";


    donorMessage.value =
      saved.message || "";


    if (
      saved.amount >= 1 &&
      saved.amount <= 500
    ) {

      selectedAmount =
        Number(
          saved.amount
        );


      selectedAmountText.textContent =
        formatMoney(
          selectedAmount
        );


      customAmount.value =
        selectedAmount;


      amountButtons.forEach(
        button => {

          button.classList.remove(
            "active"
          );

        }
      );

    }


    rememberInfo.checked =
      true;


    savedNotice.style.display =
      "block";

  }

  catch (
    error
  ) {

    localStorage.removeItem(
      "heeroDonationInfo"
    );

  }

}


/* ============================================
   DONATION BUTTON
============================================ */

donateButton.addEventListener(
  "click",
  () => {

    /*
       Check PayPal link
    */

    if (
      PAYPAL_LINK ===
      "YOUR_PAYPAL_DONATION_LINK"
    ) {

      alert(
        "You still need to add your PayPal donation link inside script.js."
      );

      return;

    }


    /*
       Validate amount
    */

    if (
      selectedAmount < 1 ||
      selectedAmount > 500
    ) {

      alert(
        "Please choose an amount between $1 and $500."
      );

      return;

    }


    /*
       Save safe information
    */

    saveInformation();


    /*
       Copy amount.

       A normal PayPal payment link does not
       automatically receive the amount selected
       on this website.

       So we copy the amount and tell the donor
       exactly what to enter on PayPal.
    */

    const money =
      formatMoney(
        selectedAmount
      );


    if (
      navigator.clipboard
    ) {

      navigator.clipboard
        .writeText(
          money
        )
        .catch(
          () => {}
        );

    }


    amountNotice.textContent =
      money +
      " selected — enter this amount on PayPal.";


    /*
       Open real PayPal payment page
    */

    window.open(
      PAYPAL_LINK,
      "_blank",
      "noopener,noreferrer"
    );

  }
);


/* ============================================
   START
============================================ */

loadSavedInformation();
