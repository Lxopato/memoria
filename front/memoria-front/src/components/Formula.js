import MathJax from 'react-mathjax2'
 
const tex = `f(T, T_i, T_o, ALL, A_0, A_r, A_{Agg})`
 

const Formula = () => {
    return (
        <div>
            <MathJax.Context input='tex'>
                <div>
                    <MathJax.Node>{tex}</MathJax.Node>
                </div>
            </MathJax.Context>
        </div>
    );
}

export default Formula;