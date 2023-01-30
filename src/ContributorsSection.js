import React, { useState, useEffect, useRef } from 'react';
import * as h from './helpers';
import './styles/ContributorsSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

function ContributorsSection({ contributors }) {
  const contributorsRef = useRef();

  const [height, setHeight] = useState();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editView, setEditView] = useState(null);

  const getContributorsSize = () => {
    const newHeight = contributorsRef.current.clientHeight;
    console.log(newHeight)
    setHeight(newHeight);
  };

  useEffect(() => {
    getContributorsSize();
  }, [contributors]);

  const handleEditStart = () => {
    setEditView('edit_options')
    setEditing(true);
  }

  const handleEditCancel = () => {
    setEditing(false);
  }

  const handleGroupOpt = () => {
    setEditView('edit_checkboxes')
  }

  const handleUngroupOpt = () => {
    // setEditing(false);
  }

  const handleCheckbox = (e) => {
    console.log(e.target.value)
  };

  const editScreenRender = () => {
    if (editView === 'edit_options') {
      return (
        <div className="EditOptions Flex Column">
          <button type="button" onClick={handleGroupOpt}>Group</button>
          <button type="button" onClick={handleUngroupOpt}>Ungroup</button>
        </div>
      )
    }

    if (editView === 'edit_checkboxes') {
      return (
        <div className="EditCheckboxes">
          <h4>Select names to group</h4>
          {contributors.map((contributor, i) => (
            <div className="CheckBoxOptionCard Flex Row">
              <input type="checkbox" value={contributor.poster} onClick={handleCheckbox} />
              <span>{contributor.poster}</span>
            </div>
          ))}
        </div>
      )
    }

    if (editView === 'edit_radios') {
      return (
        <div className="EditRadios">
        </div>
      )
    }
  }

  return (
    <div className="ContributorsSection Flex Column">
      {!editing ?
        <div className="NotEditing" ref={contributorsRef} style={{ height: `${height}px` }}>
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
        <div className="Editing" style={{ height: `${height + 100}px` }}>
          <button type="button" onClick={handleEditCancel}>Cancel</button>
          {editScreenRender()}
        </div>
      }
    </div>
  );

};

export default ContributorsSection;



