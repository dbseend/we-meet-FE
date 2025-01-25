import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
 * {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
 }

 html {
   font-size: 62.5%; // 1rem = 10px
 }

 body {
   font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
   font-size: 1.6rem;
   line-height: 1.5;
   background-color: #F5F5F5;
   color: #333333;
 }

 a {
   text-decoration: none;
   color: inherit;
 }

 button {
   border: none;
   background: none;
   cursor: pointer;
 }

 input, textarea {
   outline: none;
 }
`;
