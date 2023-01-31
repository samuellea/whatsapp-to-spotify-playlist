import React, { useState, useEffect, useRef } from 'react';
import * as h from './helpers';
import _ from 'lodash';
import './styles/ContributorsSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

function ContributorsSection({ contributors, posterAliasesInState, setPosterAliasesInState }) {
  // console.log(contributors);
  const contributorsRef = useRef();

  // const [height, setHeight] = useState();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editView, setEditView] = useState(null);

  const [main, setMain] = useState(null);
  const [namesToGroup, setNamesToGroup] = useState([]);


  // const getContributorsSize = () => {
  //   const newHeight = contributorsRef.current.clientHeight;
  //   console.log(newHeight)
  //   setHeight(newHeight);
  // };

  // useEffect(() => {
  //   getContributorsSize();
  // }, [contributors]);

  const handleEditStart = () => {
    setEditView('edit_checkboxes');
    setEditing(true);
  }

  const handleEditCancel = () => {
    setEditing(false);
    setEditView(null);
    setMain(null);
    setNamesToGroup([]);
  }

  const handleUngroup = () => {
    // let r = window.confirm(`Ungroup all names?`);
    // if (r == true) {
    const updatedAliasesInState = [];
    setPosterAliasesInState(updatedAliasesInState);
    setEditView(null);
    setEditing(false);
    // }

  }

  const handleCheckbox = (e) => {
    const value = e.target.value;
    const updatedNamesToGroup = namesToGroup.includes(value) ? [...namesToGroup.filter(e => e !== value)] : [...namesToGroup, value];
    setNamesToGroup(updatedNamesToGroup);
  };

  const handleConfirmGroupOptions = () => {
    setMain(namesToGroup[0]); // set default main when rendering edit_radios
    setEditView('edit_radios');
  };

  const handleRadio = (e) => {
    const value = e.target.value;
    const updatedMain = value;
    setMain(updatedMain);
  };

  const handleConfirmAndSaveGroup = () => {
    // let r = window.confirm(`Group these posters by the selected name?`);
    // if (r == true) {

    /*
        const posterAliasesInState = [
          { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
        ];
    
        main: 'Ben'
        namesToGroup: ['Ben', 'Sam']
    */

    const indexOfAliasObjIfAlreadyExists = posterAliasesInState.findIndex(obj => obj.aliases.some(e => namesToGroup.includes(e)));

    if (indexOfAliasObjIfAlreadyExists === -1) {
      const newNameGrouping = { main: main, aliases: [...namesToGroup] };
      updatedAliasesInState = [...posterAliasesInState, newNameGrouping];
    } else {
      const targetPosterAliasesObj = posterAliasesInState[indexOfAliasObjIfAlreadyExists];
      const newNameGrouping = { main: main, aliases: _.uniq([...namesToGroup, ...targetPosterAliasesObj.aliases]) };

    }

    let updatedAliasesInState = [];

    /*
    Do any objects with .main === main (in state here) exist in posterAliasesInState?
    If not, create a new obj with this .main, attach namesToGroup on .aliases, spread into updatedAliasesInState + set
    If YES, push all names to group that aren't our main (in state) into that object's .aliases array
    */

    console.log(updatedAliasesInState)
    setPosterAliasesInState(updatedAliasesInState);
    setMain(null);
    setNamesToGroup([]);
    setEditView(null);
    setEditing(false);
    // }
  };

  const editScreenRender = () => {
    if (editView === 'edit_checkboxes') {
      return (
        <div className="EditCheckboxes">
          <h5>Select names to group</h5>
          {contributors.map((contributor, i) => (
            <div className="CheckBoxOptionCard Flex Row">
              <input type="checkbox" id="checkbox" value={contributor.poster} onClick={handleCheckbox} />
              <span>{contributor.poster}</span>
            </div>
          ))}
          <button type="button" onClick={handleUngroup} disabled={!posterAliasesInState.length}>Ungroup</button>
          <button type="button" onClick={handleConfirmGroupOptions} disabled={namesToGroup.length < 2}>Group</button>
        </div>
      )
    }

    if (editView === 'edit_radios') {
      return (
        <div className="EditRadios">
          <h5>Pick name to group by</h5>
          {namesToGroup.map(name => (
            <div className="CheckBoxOptionCard Flex Row">
              <input type="radio" id="radio" name="group_by_name" value={name} onClick={handleRadio} />
              <span>{name}</span>
            </div>
          ))}
          <button type="button" onClick={handleConfirmAndSaveGroup}>Confirm</button>
        </div>
      )
    }
  }

  return (
    <div className="ContributorsSection Flex Column">
      {!editing ?
        // <div className="NotEditing" ref={contributorsRef} style={{ height: `${height}px` }}>
        <div className="NotEditing" ref={contributorsRef}>
          <div className="HeaderAndEditButton Flex Row">
            <h4 className="SectionHeader">Contributors</h4>
            <button type="button" onClick={handleEditStart}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </div>
          <div className="ContributorsList Flex Column">
            {contributors.map((contributor, i) => {
              return (
                <div className="ContributorCard Flex Row">
                  <div className="ContributorName">
                    {h.equalSpacedPosters(contributors, contributor.poster)}
                  </div>
                  <div className="ContributorHyphen">
                    <span>-</span>
                  </div>
                  <div className="ContributorTotal">
                    {contributor.totalPosts}
                  </div>
                  <div className="ContributorTotal">
                    {i === 0 ? <span><i class="fas fa-trophy"></i></span> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        :
        // <div className="Editing" style={{ height: `${height + 100}px` }}>
        <div className="Editing">
          <button type="button" onClick={handleEditCancel}>Cancel</button>
          {editScreenRender()}
        </div>
      }
    </div>
  );

};

export default ContributorsSection;



