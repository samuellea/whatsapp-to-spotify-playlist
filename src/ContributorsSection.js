import React, { useState, useEffect, useRef } from 'react';
import * as h from './helpers';
import _ from 'lodash';
import './styles/ContributorsSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import Spinner from './Spinner';

function ContributorsSection({ tallied, lookupInState, setLookupInState }) {
  const contributorsRef = useRef();

  // const [height, setHeight] = useState();
  const [editing, setEditing] = useState(false);
  const [editView, setEditView] = useState(null);
  const [renaming, setRenaming] = useState({ currentName: '', newName: '', error: false });
  const [grouping, setGrouping] = useState({ groupees: [], groupOn: null })

  const handleEditStart = () => {
    setEditing(true);
    setEditView('edit_options');
  };

  const handleEditCancel = () => {
    setEditView(null);
    setRenaming({ currentName: '', newName: '', error: false });
    setGrouping({ groupees: [], groupOn: null });
    setEditing(false);
  };

  const handleRevertStart = () => {
    let r = window.confirm(`Revert all names / groupings of posters? Cannot undo`);
    if (r == true) {
      const updatedLookup = { grouped: [], renamed: [] };
      setLookupInState(updatedLookup);
    }
  };

  const handleRenameStart = () => {
    setEditView('edit_rename');
  };

  const handleGroupStart = () => {
    setEditView('edit_checkboxes');
  };

  const handleRenameClick = (e) => {
    const { value } = e.target;
    setRenaming({ currentName: value, newName: '', error: false });
  }

  const handleRenameChange = (e) => {
    const { value } = e.target;
    // console.log(value);
    const { grouped, renamed } = lookupInState;
    const posterInTally = tallied.find(e => e.poster === value.trim());
    const posterInGrouped = grouped && grouped.find(e => e.poster === value.trim());
    const posterInRenamed = renamed && renamed.find(e => e.poster === value.trim());
    if (posterInTally || posterInGrouped || posterInRenamed) {
      return setRenaming({ ...renaming, newName: value, error: true });
    } else {
      return setRenaming({ ...renaming, newName: value, error: false });
    }
  };

  const handleRenameSave = () => {
    const { grouped, renamed } = lookupInState;
    const { currentName, newName } = renaming;
    let targetPoster = currentName;
    let updatedRenamed = renamed ? [...renamed] : [];
    // wait - first, check if this contributor has already been renamed
    if (renamed) {
      const objInRenamed = renamed.find(e => e.to === currentName);
      if (objInRenamed) {
        targetPoster = objInRenamed.poster;
        updatedRenamed = updatedRenamed.filter(e => e.to !== currentName);
      }
    }

    const newRenamedObj = { poster: targetPoster, to: newName };
    updatedRenamed.push(newRenamedObj);

    const updatedLookup = { ...lookupInState, renamed: updatedRenamed };
    // console.log(updatedLookup)
    // FINAL ACTION
    setEditing(false);
    setLookupInState(updatedLookup);
  };

  const handleCheckbox = (e) => {
    const { value } = e.target;
    const alreadyInGrouping = grouping.groupees.findIndex(e => e === value) !== -1;
    let updatedGrouping;
    if (alreadyInGrouping) updatedGrouping = [...grouping.groupees.filter(e => e !== value)];
    if (!alreadyInGrouping) updatedGrouping = [...grouping.groupees, value];
    setGrouping({ ...grouping, groupees: updatedGrouping });
  }

  const handleConfirmGroupCheckboxes = () => {
    setEditView('edit_radios');
  }

  const handleRadio = (e) => {
    const { value } = e.target;
    const updatedGroupOn = value;
    setGrouping({ ...grouping, groupOn: updatedGroupOn })
  }

  const handleConfirmGroupOn = () => {
    // console.log(lookupInState);
    const { grouped, renamed } = lookupInState;
    // console.log(grouping)
    const { groupees, groupOn } = grouping;

    // set the groupOn value for new groupee 'grouped' arr objects,
    // firstly checking if the groupOn in question has been renamed
    let targetOn = groupOn;

    if (renamed) {
      // const groupOnObjInRenamed = renamed.find(e => e.poster === groupOn); // 🚧 🚧 🚧
      const groupOnObjInRenamed = renamed.find(e => e.to === groupOn);

      // if (!groupOnObjInRenamed) targetOn = groupOn;
      if (groupOnObjInRenamed) targetOn = groupOnObjInRenamed.poster;
    }

    // filter groupees to not include the groupOn value
    const onlyGroupees = groupees.filter(e => e !== groupOn);

    let updatedGrouped = grouped ? [...grouped] : [];
    let updatedRenamed = renamed ? [...renamed] : [];

    // then, make up new 'grouped' arr objects for each of these groupees
    onlyGroupees.forEach(groupee => {
      let targetPoster = groupee;
      // decide the new obj's .poster value, firstly checking if this groupee has been renamed
      if (renamed) {
        const objInRenamed = renamed.find(e => e.to === groupee);
        if (objInRenamed) {
          targetPoster = objInRenamed.poster;
          // and remove this obj from renamed
          updatedRenamed = updatedRenamed.filter(e => e.to !== groupee);
        }
      }



      const newGroupeeObj = { poster: targetPoster, on: targetOn };

      // next, check if this groupee has groupees (in 'grouped' arr) TOO -
      // if so, re-group THEM to the new targetOn (groupOn)
      const indexesOfObjsInGrouped = updatedGrouped.reduce((acc, e, i) => {
        if (e.on === targetPoster) acc.push(i);
        return acc;
      }, []);

      if (indexesOfObjsInGrouped.length) {
        indexesOfObjsInGrouped.forEach(objIndex => updatedGrouped[objIndex] = { ...updatedGrouped[objIndex], on: targetOn });
      }

      updatedGrouped.push(newGroupeeObj);
    })


    const updatedLookup = { grouped: updatedGrouped, renamed: updatedRenamed };
    // console.log(updatedLookup)
    // FINAL ACTION
    setEditing(false);
    setLookupInState(updatedLookup);
  }

  const handleShowGroups = () => {
    setEditView('edit_see_groups');
  };

  const editScreenRender = () => {

    if (editView === 'edit_options') {
      const { grouped = [], renamed = [] } = lookupInState;
      const revertDisabled = !grouped.length && !renamed.length;
      return (
        <div className="EditOptions Flex Column">
          <button type="button" onClick={handleRevertStart} disabled={revertDisabled}>Revert All Names / Groups</button>
          <button type="button" onClick={handleRenameStart}>Rename</button>
          <button type="button" onClick={handleGroupStart}>Group</button>
          <button type="button" onClick={handleShowGroups} disabled={!lookupInState.grouped}>See Groups</button>
        </div>
      );
    };

    if (editView === 'edit_rename') {
      return (
        <div className="EditRename">
          <h5>RENAME</h5>
          {tallied.map(tallyObj => {
            const errorOnThisField = renaming.currentName === tallyObj.poster && renaming.error;
            return (
              <div className="RenameInputContainer Flex">
                {renaming.currentName === tallyObj.poster ?
                  // <div className="RenameInputActiveControls">
                  <input type="text" value={renaming.newName} onChange={handleRenameChange} placeholder={tallyObj.poster} />
                  // </div>
                  : <button type="button" value={tallyObj.poster} onClick={(event) => handleRenameClick(event)}>
                    {tallyObj.poster}
                  </button>
                }
                <button
                  type="button"
                  onClick={handleRenameSave}
                  disabled={errorOnThisField}
                  style={{ visibility: renaming.currentName === tallyObj.poster ? 'visible' : 'hidden' }}
                >Save</button>
                {errorOnThisField ? <span>(Error)</span> : null}
              </div>
            )
          })}
        </div>
      );
    };


    if (editView === 'edit_checkboxes') {
      return (
        <div className="EditCheckboxes">
          {tallied.map(tallyObj => {
            return (
              <div className="CheckBoxOptionCard Flex Row">
                <input type="checkbox" id="checkbox" value={tallyObj.poster} onClick={handleCheckbox} />
                <span>{tallyObj.poster}</span>
              </div>
            )
          })}
          <button type="button" onClick={handleConfirmGroupCheckboxes} disabled={grouping.groupees.length < 2}>Group</button>
        </div>
      )
    }

    if (editView === 'edit_radios') {
      return (
        <div className="EditRadios">
          {grouping.groupees.map(groupee => {
            return (
              <div className="CheckBoxOptionCard Flex Row">
                <input type="radio" id="radio" name="group_by_name" value={groupee} onClick={handleRadio} checked={groupee === grouping.groupOn} />
                <span>{groupee}</span>
              </div>
            )
          })}
          <button type="button" onClick={handleConfirmGroupOn} disabled={!grouping.groupOn}>Confirm Group</button>
        </div>
      )
    }

    if (editView === 'edit_see_groups') {
      const { grouped, renamed } = lookupInState;
      const groupTally = h.calcGroupTally(grouped, renamed);
      // console.log(groupTally);
      return (
        <div className="EditSeeGroups">
          {groupTally.map(group => (
            <div className="GroupContainer">
              <div className="GroupName">
                <span>{group.groupName}</span>
              </div>
              <div className="GroupGroupees Flex Column">
                {group.groupees.map(groupee => (
                  <span>{groupee}</span>
                ))}
              </div>
            </div>
          ))}
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
            {tallied.map((contributor, i) => {
              return (
                <div className="ContributorCard Flex Row">
                  <div className="ContributorGroupIcon Flex">
                    {!h.isContributorAGroup(lookupInState, contributor.poster) ?
                      null : <FontAwesomeIcon icon={faUserGroup} />}
                  </div>
                  <div className="ContributorName">
                    <span>{h.equalSpacedPosters(tallied, contributor.poster)}</span>
                  </div>
                  <div className="ContributorHyphen">
                    <span>-</span>
                  </div>
                  <div className="ContributorTotal">
                    {contributor.totalPosts}
                  </div>
                  <div className="ContributorTrophy">
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



