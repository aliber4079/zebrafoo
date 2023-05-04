import styles from './symptombox.module.css';

export default function SymptomBox({hits}) {
	const synonyms = hits.synonyms?.map( i => <li>{i}</li>)
	return (
			<div id={hits.id} className={styles.container} draggable droppable={true}  onDragStart={e => {
	e.dataTransfer.effectAllowed = "move";
	e.dataTransfer.setData("text/plain", hits.id)
				console.log("setdata",hits.id)
			}}>
			<div name="symptomlabel" className={styles.symptomlabel} >
				{hits.lbl}
		<button  title="Remove tag"><svg  width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></button>
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
