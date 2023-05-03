import styles from './symptombox.module.css';

export default function SymptomBox({hits}) {
	const synonyms = hits.synonyms?.map( i => <li>{i}</li>)
	return (
			<div id={hits.id} className={styles.container} draggable droppable={true}  onDragStart={e => {
	e.dataTransfer.effectAllowed = "move";
	e.dataTransfer.setData("text/plain", hits.id)
			}}>
			<div name="symptomlabel" className={styles.symptomlabel} >
				{hits.lbl}
			</div>
			<div name="synonyms" >
			 {synonyms}
			</div>
			</div>
		)
	function getParentId() {
	 console.log("getparentid")
	}
}
