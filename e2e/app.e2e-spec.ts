import { Io17Page } from './app.po';

describe('io17 App', () => {
  let page: Io17Page;

  beforeEach(() => {
    page = new Io17Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
