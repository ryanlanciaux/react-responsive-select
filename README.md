# React Responsive Select

A keyboard accessible React custom select - **alpha version**.

<img src="https://media1.giphy.com/media/401CMO1Du5cju/giphy.gif" width="40%" /> <img src="https://media1.giphy.com/media/D4aqbOMrQnHxK/giphy.gif" width="30%" />

## Setup

- `npm i`
- `npm start`

## Select Box Keyboard Accessibility Tests
 
#### When not focused
- Select Input receives focus when **TABBED** to

#### When focused and closed
- hitting **TAB** key should blur Select Input
- hitting **DOWN** key should open the options panel and signify selected item
- hitting **UP** key should open the options panel and signify selected item
- hitting **SPACE** key should open the options panel and signify selected item
- hitting **ENTER** key should submit the form

#### When focused and open
- hitting **TAB** key should not blur Select Input
- hitting **DOWN** key should signify selected item and decrement down the options panel - signifying next potential selection
- hitting **UP** key should signify selected item and increment up the options panel - signifying next potential selection
- hitting **ENTER** key should select the current signified option and close the options panel
- hitting **SPACE** key should select the current signified option and close the options panel
- hitting **ESC** key should close the options panel and keep current selection

## Device tests

#### Destop browsers
- :white_check_mark: Chrome latest
- :white_check_mark: Safari latest
- :white_check_mark: Firefox latest
- :white_check_mark: IE 11.

#### Android
- :white_check_mark: Nexus 5 - Android 4.4 (Chrome)
- ? Samsung Galaxy S3 - Android 4 (Native)

#### iPhone
- :white_check_mark: iPhone 6+ - iOS 9 (Safari)
- :white_check_mark: iPhone 5 - iOS 6 (Safari)

#### iPad
- :white_check_mark: iPad Pro - iOS 10
- :white_check_mark: iPad Air 2 - iOS 9.3
- :white_check_mark: iPad Mini - iOS 7
- :white_check_mark: iPad 3 - iOS 6
- :x: iPad 3 - iOS 5.1
- :x: iPad 2 - iOS 5