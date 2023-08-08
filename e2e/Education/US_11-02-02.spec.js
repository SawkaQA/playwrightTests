const { test, expect } = require("@playwright/test");
const { Header } = require("../../pages/header");
const { LoginPage } = require("../../pages/login");
const { BannerBtn } = require("../../pages/bannerButtons")

let header;
let page;
let login;
let bannerBtn;
const language = "العَرَبِيَّة";
const country = "United Arab Emirates";

test.describe("US_11-02-02_Education > Menu item [Share trading] on UnReg Role", () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    header = new Header(page);
    // open capital.com
    await page.goto("/");
    //accept all Cookies
    await header.clickAcceptAllCookies();
    // select country and language
    await header.hoverCountryAndLang();
    await page.getByRole("textbox").first().click();
    await page.getByRole("link", { name: country }).click();
    await header.hoverCountryAndLang()
    await page.getByRole("link", { name: language }).click();
    await header.getEducationMenu.hover();
    await header.clickSharesTrading();

  });

  test(`TC_11.02.02_01_UnReg  > Test button [Start Trading] in Main banner on '${language}' language`, async () => {
    bannerBtn = new BannerBtn(page);
    const fs = require('fs');
    await bannerBtn.clickStartTradingBtnOnMainBanner();
    await expect(page.locator("#s_overlay > .form-container-white")).toBeVisible();
    const elementText = await page.$eval('#s_overlay', element => element.innerText);
    expect(elementText).toBeTruthy();
    await expect(page.locator('[class="signup-form"] .h1')).toBeVisible();
    await expect(page.locator('#s_overlay-email > .field__control')).toHaveAttribute("type", "email");
    await expect(page.locator('#s_overlay-pass > .field__control')).toHaveAttribute("type", "password");
    await expect(page.locator('.signup-form > .form-container-small-content > form > .btn')).toBeVisible();
    await page.locator('#s_overlay .form-container-white .button-cleared').click();
    console.log(`Testing the first level on the page 'https://capital.com/ar/trade-stocks ' completed successfully `);
    await page.waitForTimeout(20000);
    /* извлечение значения атрибута href (el.href) каждого элемента и добавление его в новый массив.Окончательный результат - массив links, 
    содержащий все значения атрибута href выбранных элементов <a> */
    const links = await page.$$eval('a[data-type="sidebar_deeplink"]', (elements) => elements.map((el) => el.href));
    if (links.length === 0) {
      console.log("There are no links on this page and testing of the second level is impossible");
    } else {
      console.log("links", links);
    }

    // запись элементов массива "links" в файл "links.txt" с использованием метода "writeFileSync" из модуля "fs"
    fs.writeFileSync('links.txt', links.join('\n'));
    // Содержимое файла "links.txt" считывается с использованием метода "readFileSync" из модуля "fs" и сохраняется в переменную "fileContent"
    const fileContent = fs.readFileSync('links.txt', 'utf-8');
    const linksFromFile = fileContent.split('\n').filter((link) => link !== '');
    const randomLinks = getRandomElements(linksFromFile, 3);
    for (let i = 1; i < randomLinks.length; i++) {
      await page.goto(randomLinks[i]);
      await bannerBtn.clickStartTradingBtnOnMainBanner();
      await expect(page.locator("#s_overlay > .form-container-white")).toBeVisible();
      const elementText = await page.$eval('#s_overlay', element => element.innerText);
      expect(elementText).toBeTruthy();
      await expect(page.locator('[class="signup-form"] .h1')).toBeVisible();
      await expect(page.locator('#s_overlay-email > .field__control')).toHaveAttribute("type", "email");
      await expect(page.locator('#s_overlay-pass > .field__control')).toHaveAttribute("type", "password");
      await expect(page.locator('.signup-form > .form-container-small-content > form > .btn')).toBeVisible();
      await page.locator('#s_overlay .form-container-white .button-cleared').click();

      if (randomLinks.includes(randomLinks[i])) {
        console.log(`Testing on the '${randomLinks[i]}' link was successfully completed `);
      } else {
        console.log(`Testing on the '${randomLinks[i]}' link was failed`);
      }

    }


    // Функция для получения случайных элементов из массива

    function getRandomElements(array, count) {
      const randomized = array.slice();
      for (let i = randomized.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
      }
      return randomized.slice(0, count);
    }

  });

})

test.describe("US_11-02-02_Education > Menu item [Share trading] on UnAuth Role", () => {
  const testData = {
    email: "sadsass@gmail.com",
    password: "123Qwert!@dsdDs",
  }
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    header = new Header(page);
    login = new LoginPage(page);
    // open capital.com
    await page.goto("/");
    // user unauthorization
    await login.clickBtnLogIn();
    await login.validLogin(testData.email, testData.password);
    await login.continueButton.waitFor();
    await login.continueButton.click();
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.locator('#wg_userarea').click();
    await page.locator('.logout-user').click();
    // select country and language
    await header.hoverCountryAndLang();
    await page.getByRole("textbox").first().click();
    await page.getByRole("link", { name: country }).click();
    await header.hoverCountryAndLang()
    await page.getByRole("link", { name: language }).click();
    await header.getEducationMenu.hover();
    await header.clickSharesTrading();

  });

  test(`TC_11.02.02_01_UnAuth  > Test button [Start Trading] in Main banner on '${language}' language`, async () => {
    bannerBtn = new BannerBtn(page);
    const fs = require('fs');
    await bannerBtn.clickStartTradingBtnOnMainBanner();
    try {
      await expect(page.locator("#l_overlay > .form-container-white")).toBeVisible();
    } catch (error) {
      console.log("Opened a 'Sign up' form instead of a 'Login' form");
      throw new Error("Test failed");
    }
    const elementText = await page.$eval('#l_overlay', element => element.innerText);
    expect(elementText).toBeTruthy();
    await expect(page.locator("div.form-container-small-header.s-between")).toBeVisible();
    await expect(page.locator("#l_f_email > .field__control")).toHaveAttribute("type", "email");
    await expect(page.locator("#l_f_pass > .field__control")).toHaveAttribute("type", "password");
    expect(await page.locator("input[name=l_rem]").isChecked());
    await expect(page.locator('[class="l_btn_forgot"]')).toBeVisible();
    await expect(page.locator(".form-container-white > .form-container-small-content > form > .btn")).toBeVisible();
    await expect(page.locator(".form-container-white > .form-container-small-header > p > .l_btn_signup")).toBeVisible();
    await page.locator("#l_overlay .form-container-white .button-cleared").click();
    console.log(`Testing the first level on the page 'https://capital.com/ar/trade-stocks ' completed successfully `)
    await page.waitForTimeout(20000);
    /* извлечение значения атрибута href (el.href) каждого элемента и добавление его в новый массив.Окончательный результат - массив links, 
    содержащий все значения атрибута href выбранных элементов <a> */
    const links = await page.$$eval('a[data-type="sidebar_deeplink"]', (elements) => elements.map((el) => el.href));
    if (links.length === 0) {
      console.log("There are no links on this page and testing of the second level is impossible");
    } else {
      console.log("links", links);
    }
    // запись элементов массива "links" в файл "links.txt" с использованием метода "writeFileSync" из модуля "fs"
    fs.writeFileSync('links.txt', links.join('\n'));
    // Содержимое файла "links.txt" считывается с использованием метода "readFileSync" из модуля "fs" и сохраняется в переменную "fileContent"
    const fileContent = fs.readFileSync('links.txt', 'utf-8');
    const linksFromFile = fileContent.split('\n').filter((link) => link !== '');
    const randomLinks = getRandomElements(linksFromFile, 3);

    for (let i = 1; i < randomLinks.length; i++) {
      await page.goto(randomLinks[i]);
      await bannerBtn.clickStartTradingBtnOnMainBanner();

      try {
        await expect(page.locator("#l_overlay > .form-container-white")).toBeVisible();
      } catch (error) {
        console.log("Opened a 'Sign up' form instead of a 'Login' form");
      }

      const elementText = await page.$eval('#l_overlay', element => element.innerText);
      expect(elementText).toBeTruthy();
      await expect(page.locator("[class='form-container-small-header'] > .h1")).toBeVisible();
      await expect(page.locator("#l_f_email > .field__control")).toHaveAttribute("type", "email");
      await expect(page.locator("#l_f_pass > .field__control")).toHaveAttribute("type", "password");
      expect(await page.getByLabel("input[name=l_rem]").isChecked());
      await expect(page.locator('[class="l_btn_forgot"]')).toBeVisible();
      await expect(page.locator(".form-container-white > .form-container-small-content > form > .btn")).toBeVisible();
      await expect(page.locator(".form-container-white > .form-container-small-header > p > .l_btn_signup")).toBeVisible();
      await page.locator("#l_overlay .form-container-white .button-cleared").click();

      if (randomLinks.includes(randomLinks[i])) {
        console.log(`Testing on the '${randomLinks[i]}' link was successfully completed `);
      } else {
        console.log(`Testing on the '${randomLinks[i]}' link was failed`);
      }

    }

    // Функция для получения случайных элементов из массива

    function getRandomElements(array, count) {
      const randomized = array.slice();
      for (let i = randomized.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
      }
      return randomized.slice(0, count);
    }

  });

})



























