import { Io17v2Page } from './app.po';

describe('io17v2 App', () => {
  let page: Io17v2Page;

  beforeEach(() => {
    page = new Io17v2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
