import React from 'react';

const MyForm = ({
    f,
    setf,
    T,
    setT,
    Ti,
    setTi,
    T0,
    setT0,
    ALL,
    setALL,
    A0,
    setA0,
    Ar,
    setAr,
    AAgg,
    setAAgg,
  }) => {

  return (
    <div>
        <br />
        {"f(T, T_i, T_o, ALL, A_0, A_r, A_{Agg})"}
        <br />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <label>
            f:
            <input type="text" value={f} onChange={(e) => setf(e.target.value)} />
        </label>
        <label>
            T:
            <input type="text" value={T} onChange={(e) => setT(e.target.value)} />
        </label>

        <label>
            Ti:
            <input type="text" value={Ti} onChange={(e) => setTi(e.target.value)} />
        </label>

        <label>
            T0:
            <input type="text" value={T0} onChange={(e) => setT0(e.target.value)} />
        </label>

        <label>
            ALL:
            <input type="text" value={ALL} onChange={(e) => setALL(e.target.value)} />
        </label>

        <label>
            A0:
            <textarea type="text" value={A0} onChange={(e) => setA0(e.target.value)} />
        </label>

        <label>
            Ar:
            <textarea type="text" value={Ar} onChange={(e) => setAr(e.target.value)} />
        </label>

        <label>
            AAgg:
            <textarea type="text" value={AAgg} onChange={(e) => setAAgg(e.target.value)} />
        </label>
        </div>
        <br />
    </div>
      );
};

export default MyForm;
