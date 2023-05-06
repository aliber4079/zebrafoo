import styles from './differential.module.css'

export default function Differential({diffData,title}) {

	return (<>
		 <div style={{"float":"left"}}>
		  <div>{title}</div>
		 <div id="differential" className={styles.differential} >
		  {diffData}
		</div>
		</div>
		</>
	)
}
