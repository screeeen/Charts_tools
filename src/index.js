import React from 'react';
import { createRoot } from 'react-dom/client';
// import Example from './Example.js';
// import ExampleMulti from './ExampleMulti.js';

import { ChartRechart } from './Attic/ChartRechart.js';
import { WithChartJS } from './WithChartJS.js';
import { WithChartJS_2 } from './WithChartJS_2.js';
import { VerySimple_2 } from './VerySimple_2.js';
import { VerySimple_3 } from './VerySimple_3.js';
import { VerySimple_4 } from './VerySimple_4.js';

const container = document.getElementById('root');

const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<VerySimple_4 />);
